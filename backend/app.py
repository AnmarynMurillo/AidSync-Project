from flask import Flask, request, jsonify, session, make_response
import src.auth.firebase_auth
from src.users.user_service import register_user, login_user, get_profile, update_profile, update_photo
from flask_cors import CORS
from firebase_admin import auth as firebase_auth, storage
from firebase_admin._auth_utils import EmailAlreadyExistsError
import traceback
import os
import re
import logging
from dotenv import load_dotenv
import requests
import base64

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)
# Habilita CORS para todas las rutas y permite credenciales.
# En desarrollo permitimos cualquier origen; en producción restringe a tu frontend.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": os.environ.get('FRONTEND_ORIGIN', '*')}})

app.secret_key = os.environ.get('SECRET_KEY', 'supersecretkey')  # Necesario para sesiones

# Configura logging para mejor trazabilidad
logging.basicConfig(level=logging.INFO)

# Limitar tamaño máximo de subida a 2 MB para fotos (evita uploads gigantes)
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 MiB

# Asegura que las respuestas incluyan los encabezados CORS requeridos (para preflight y Authorization)
@app.after_request
def add_cors_headers(response):
    # Permitir el origen del frontend o eco del Origin si está en modo wildcard
    configured_origin = os.environ.get('FRONTEND_ORIGIN', '*')
    request_origin = request.headers.get('Origin')
    # Si el administrador dejó '*' (dev), hacemos echo del Origin real para soportar
    # solicitudes con credentials (el navegador rechaza '*' cuando Access-Control-Allow-Credentials es true).
    if configured_origin == '*' and request_origin:
        response.headers['Access-Control-Allow-Origin'] = request_origin
    else:
        response.headers['Access-Control-Allow-Origin'] = configured_origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    # Permitir estos encabezados en preflight (incluye Accept)
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    # Recomendado para proxies/CDN
    response.headers['Vary'] = 'Origin'
    # Opcional: cache del preflight
    response.headers['Access-Control-Max-Age'] = '86400'
    return response

# Inicializa Firebase


def is_valid_email(email):
    # Validación básica de email
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_strong_password(password):
    # Al menos 6 caracteres, una mayúscula, una minúscula y un número
    return (
        isinstance(password, str) and
        len(password) >= 6 and
        re.search(r"[A-Z]", password) and
        re.search(r"[a-z]", password) and
        re.search(r"\d", password)
    )

@app.route("/")
def index():
    return "API de Voluntariados funcionando ✅"

@app.route("/api/config")
def get_config():
    """Endpoint para servir configuraciones al frontend de forma segura"""
    return jsonify({
        "firebase": {
            "apiKey": os.environ.get('FIREBASE_API_KEY'),
            "authDomain": os.environ.get('FIREBASE_AUTH_DOMAIN'),
            "projectId": os.environ.get('FIREBASE_PROJECT_ID'),
            "storageBucket": os.environ.get('FIREBASE_STORAGE_BUCKET'),
            "messagingSenderId": os.environ.get('FIREBASE_MESSAGING_SENDER_ID'),
            "appId": os.environ.get('FIREBASE_APP_ID'),
            "databaseURL": os.environ.get('FIREBASE_DATABASE_URL')
        },
        "backend": {
            "url": os.environ.get('BACKEND_URL', 'http://localhost:5000')
        },
        "imgbb": {
            # Carga la clave desde la variable de entorno IMGBB_API_KEY; usa la clave proporcionada como fallback
            "apiKey": os.environ.get('IMGBB_API_KEY', '1e66bbbd585957283148f799c1a73de4')
        }
    })

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        age = data.get("age")
        area = data.get("area")

        # Validaciones básicas
        if not email or not password or not name or not age or not area:
            return jsonify({"success": False, "message": "All fields are required."}), 400
        if not is_valid_email(email):
            return jsonify({"success": False, "message": "Invalid email format."}), 400
        if not is_strong_password(password):
            return jsonify({"success": False, "message": "Password too weak."}), 400

        # Verifica si el correo ya existe en Firebase Auth
        try:
            firebase_auth.get_user_by_email(email)
            return jsonify({"success": False, "message": "This email is already registered."}), 409
        except firebase_auth.UserNotFoundError:
            pass

        # 1) Ejecutar el registro real
        reg_resp = register_user()

        # 2) Si el registro fue exitoso, iniciar sesión automáticamente reutilizando /login
        try:
            status_code = getattr(reg_resp, "status_code", 200)
            reg_json = None
            try:
                reg_json = reg_resp.get_json()
            except Exception:
                reg_json = None

            if status_code in (200, 201) and reg_json and reg_json.get("success"):
                # Crear un contexto de petición para llamar login_user con las mismas credenciales
                with app.test_request_context('/login', method='POST', json={'email': email, 'password': password}):
                    login_resp = login_user()

                # Construir la respuesta final con autoLogin + redirect y copiar cookies
                try:
                    login_json = login_resp.get_json() or {}
                except Exception:
                    login_json = {}

                payload = {
                    **login_json,
                    "success": True,
                    "autoLogin": True,
                    "redirect": "/public/pages/blog.html"
                }
                final_resp = make_response(jsonify(payload), 200)

                # Forward de Set-Cookie para conservar la sesión creada por login_user
                for h, v in login_resp.headers:
                    if h.lower() == 'set-cookie':
                        final_resp.headers.add('Set-Cookie', v)

                return final_resp

            # Si el registro no fue exitoso, retornar tal cual
            return reg_resp
        except Exception as e:
            logging.error(f"Auto-login after register failed: {e}")
            return reg_resp

    except Exception as e:
        logging.error(f"Error in /register: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": "Internal server error."}), 500

# Rutas de usuario (la lógica está en user_service.py)
app.add_url_rule('/login', view_func=login_user, methods=['POST'])
app.add_url_rule('/profile', view_func=get_profile, methods=['GET'])
app.add_url_rule('/profile/update', view_func=update_profile, methods=['POST'])
# NOTE: Reemplazamos la wiring original de /profile/photo por un endpoint dedicado
# que sube la imagen a ImgBB desde el servidor y devuelve la URL pública.
# El frontend puede seguir llamando a /profile/photo con:
# - Authorization: Bearer <idToken>  (opcional pero recomendado)
# - credentials: 'include' si usa cookies de sesión
# y FormData con campo 'foto'.
@app.route('/profile/photo', methods=['POST', 'OPTIONS'])
def profile_photo():
    """
    Endpoint: recibe un archivo 'foto' y lo sube a ImgBB.
    Retorna JSON: { success: True, foto_url: "<url>" } o error.
    Validaciones:
      - requiere archivo 'foto' en form-data
      - tipo MIME debe comenzar con 'image/'
      - tamaño <= MAX_CONTENT_LENGTH
    Autenticación:
      - intenta extraer token Bearer del header Authorization y verificarlo con Firebase Admin
      - si no hay token válido, no se bloquea la subida (pero no se asociará a uid en backend)
    Importante:
      - no hace escritura en RTDB por seguridad; deja que el frontend actualice users/{uid}/foto_url
        (esto evita necesidad de inicializar DB aquí si no está preparado).
      - si quieres que el servidor también escriba en RTDB, se puede añadir verificación y uso
        de firebase_admin.db (requiere inicialización y permisos).
    """
    # Responder rápido a preflight OPTIONS
    if request.method == 'OPTIONS':
        response = make_response('', 204)
        return response

    # 1) obtener token Bearer opcional
    token = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()

    uid = None
    if token:
        try:
            # verifica token con Firebase Admin (si firebase admin está inicializado)
            decoded = firebase_auth.verify_id_token(token)
            uid = decoded.get('uid') or decoded.get('user_id')
        except Exception as e:
            # Token inválido o firebase admin no inicializado: lo registramos y seguimos
            logging.warning(f"Invalid/failed Firebase token verification: {e}")

    # 2) validar archivo
    if 'foto' not in request.files:
        return jsonify({"success": False, "message": "No file provided under 'foto' field."}), 400

    file = request.files['foto']
    if file.filename == '':
        return jsonify({"success": False, "message": "Empty filename."}), 400

    # validar tipo MIME básico
    mimetype = file.mimetype or ''
    if not mimetype.startswith('image/'):
        return jsonify({"success": False, "message": "Uploaded file is not an image."}), 400

    # validar tamaño (Flask ya lanza 413 si supera MAX_CONTENT_LENGTH, pero comprobamos por seguridad)
    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(0)
    if size > app.config['MAX_CONTENT_LENGTH']:
        return jsonify({"success": False, "message": "File too large. Max 2MB allowed."}), 413

    # 3) preparar base64 para ImgBB
    try:
        file_bytes = file.read()
        imgbb_payload = base64.b64encode(file_bytes).decode('utf-8')
    except Exception as e:
        logging.error(f"Failed reading/encoding file: {e}")
        return jsonify({"success": False, "message": "Failed to process file."}), 500

    # 4) llamar a ImgBB API (lee clave desde env o usa fallback seguro)
    imgbb_key = os.environ.get('IMGBB_API_KEY', '1e66bbbd585957283148f799c1a73de4')
    imgbb_url = f"https://api.imgbb.com/1/upload?key={imgbb_key}"
    try:
        # Enviamos como form-data con campo 'image' = base64 string
        resp = requests.post(imgbb_url, data={'image': imgbb_payload}, timeout=15)
    except requests.RequestException as e:
        logging.error(f"ImgBB request failed: {e}")
        return jsonify({"success": False, "message": "Failed to upload to ImgBB."}), 502

    if resp.status_code != 200:
        logging.error(f"ImgBB returned non-200: {resp.status_code} - {resp.text}")
        return jsonify({"success": False, "message": "ImgBB upload failed."}), 502

    try:
        j = resp.json()
        foto_url = j.get('data', {}).get('display_url') or j.get('data', {}).get('url')
        if not foto_url:
            logging.error(f"ImgBB response missing url: {j}")
            return jsonify({"success": False, "message": "ImgBB response malformed."}), 502
    except Exception as e:
        logging.error(f"Failed parsing ImgBB response: {e}")
        return jsonify({"success": False, "message": "ImgBB response invalid."}), 502

    # 5) respuesta: devolvemos la URL pública al frontend
    # El frontend (profile.js) se encargará de actualizar users/{uid}/foto_url en Realtime DB
    # si tiene sesión de Firebase en el cliente.
    result = {"success": True, "foto_url": foto_url}
    return jsonify(result), 200

if __name__ == "__main__":
    app.run(debug=True)