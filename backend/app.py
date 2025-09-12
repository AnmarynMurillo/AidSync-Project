from flask import Flask, request, jsonify, session, make_response
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
import importlib

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)
# Habilita CORS para todas las rutas y permite credenciales.
# En desarrollo permitimos cualquier origen; en producción restringe a tu frontend.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": os.environ.get('FRONTEND_ORIGIN', '*')}})

app.secret_key = os.environ.get('SECRET_KEY', 'supersecretkey')  # Necesario para sesiones

# Configura logging para mejor trazabilidad
logging.basicConfig(level=logging.INFO)

# --- SAFE Firebase Admin init (no hardcoded file required) ---
try:
    import firebase_admin
    from firebase_admin import credentials as _fa_credentials
    if not firebase_admin._apps:
        # Prefer explicit env var path if provided
        sa_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS') or os.environ.get('FIREBASE_SERVICE_ACCOUNT')
        if sa_path and os.path.exists(sa_path):
            firebase_admin.initialize_app(_fa_credentials.Certificate(sa_path))
            logging.info("Firebase Admin initialized with service account file.")
        else:
            # Try ADC (gcloud, workload identity, etc.)
            try:
                firebase_admin.initialize_app()
                logging.info("Firebase Admin initialized via Application Default Credentials.")
            except Exception as e:
                logging.warning(f"Firebase Admin not initialized (no credentials found). Continuing without Admin. Reason: {e}")
except Exception as e:
    logging.warning(f"Firebase Admin import/init failed. Continuing without Admin. Reason: {e}")

def get_user_service():
    """Lazy import to avoid crashing if firestore_service requires missing credentials."""
    try:
        return importlib.import_module('src.users.user_service')
    except Exception as e:
        logging.error(f"user_service import failed: {e}")
        return None

# Limitar tamaño máximo de subida a 2 MB para fotos (evita uploads gigantes)
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 MiB

# Asegura que las respuestas incluyan los encabezados CORS requeridos (para preflight y Authorization)
@app.after_request
def add_cors_headers(response):
    configured_origin = os.environ.get('FRONTEND_ORIGIN', '*')
    request_origin = request.headers.get('Origin')
    if configured_origin == '*' and request_origin:
        response.headers['Access-Control-Allow-Origin'] = request_origin
    else:
        response.headers['Access-Control-Allow-Origin'] = configured_origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    # include common headers used by browsers in preflight
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Authorization, Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Vary'] = 'Origin'
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
            "apiKey": os.environ.get('FIREBASE_API_KEY', "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo"),
            "authDomain": os.environ.get('FIREBASE_AUTH_DOMAIN', "expo-project-1040e.firebaseapp.com"),
            "projectId": os.environ.get('FIREBASE_PROJECT_ID', "expo-project-1040e"),
            "storageBucket": os.environ.get('FIREBASE_STORAGE_BUCKET', "expo-project-1040e.appspot.com"),
            "messagingSenderId": os.environ.get('FIREBASE_MESSAGING_SENDER_ID', "123456789012"),
            "appId": os.environ.get('FIREBASE_APP_ID', "1:123456789012:web:abcdef123456"),
            "databaseURL": os.environ.get('FIREBASE_DATABASE_URL', "https://expo-project-1040e-default-rtdb.firebaseio.com")
        },
        "backend": {
            "url": os.environ.get('BACKEND_URL', 'http://localhost:5000')
        },
        "imgbb": {
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
        username = (data.get("username") or "").strip()
        area = data.get("area")
        account_type = (data.get("accountType") or "").strip().lower()

        # Validaciones básicas
        if not email or not password or not name or not age or not username or not area or not account_type:
            return jsonify({"success": False, "message": "All fields are required."}), 400
        if not is_valid_email(email):
            return jsonify({"success": False, "message": "Invalid email format."}), 400
        if not is_strong_password(password):
            return jsonify({"success": False, "message": "Password too weak."}), 400
        # Username simple check (3-20, alfanumérico y _ . -)
        if not re.match(r"^[A-Za-z0-9_.-]{3,20}$", username):
            return jsonify({"success": False, "message": "Invalid username format."}), 400
        allowed_types = {"volunteer", "foundation", "fundation"}
        if account_type not in allowed_types:
            return jsonify({"success": False, "message": "Invalid account type."}), 400

        # Verifica si el correo ya existe en Firebase Auth
        # Duplicate email check guarded if Admin not initialized
        try:
            firebase_auth.get_user_by_email(email)
            return jsonify({"success": False, "message": "This email is already registered."}), 409
        except Exception as e:
            # Skip only when it's a "not found" or admin not initialized
            if getattr(e, '__class__', None).__name__ == 'UserNotFoundError':
                pass
            else:
                logging.warning(f"Skipping duplicate email check (Admin not ready?): {e}")

        us = get_user_service()
        if not us:
            return jsonify({"success": False, "message": "Backend user service unavailable."}), 503

        # Ejecutar el registro real
        reg_resp = us.register_user()

        # Auto-login + redirect (sin cambios, pero usando lazy import)
        try:
            status_code = getattr(reg_resp, "status_code", 200)
            reg_json = None
            try:
                reg_json = reg_resp.get_json()
            except Exception:
                reg_json = None

            if status_code in (200, 201) and reg_json and reg_json.get("success"):
                # login with same credentials
                with app.test_request_context('/login', method='POST', json={'email': email, 'password': password}):
                    login_resp = us.login_user()

                try:
                    login_json = login_resp.get_json() or {}
                except Exception:
                    login_json = {}

                payload = {**login_json, "success": True, "autoLogin": True, "redirect": "/public/pages/blog.html"}
                final_resp = make_response(jsonify(payload), 200)

                for h, v in login_resp.headers:
                    if h.lower() == 'set-cookie':
                        final_resp.headers.add('Set-Cookie', v)

                return final_resp

            return reg_resp
        except Exception as e:
            logging.error(f"Auto-login after register failed: {e}")
            return reg_resp

    except Exception as e:
        logging.error(f"Error in /register: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": "Internal server error."}), 500

@app.route('/login', methods=['POST'])
def login_route():
    us = get_user_service()
    if not us:
        return jsonify({"success": False, "message": "Backend user service unavailable."}), 503
    return us.login_user()

@app.route('/profile', methods=['GET'])
def profile_route():
    us = get_user_service()
    if not us:
        return jsonify({"success": False, "message": "Backend user service unavailable."}), 503
    return us.get_profile()

@app.route('/profile/update', methods=['POST'])
def profile_update_route():
    us = get_user_service()
    if not us:
        return jsonify({"success": False, "message": "Backend user service unavailable."}), 503
    return us.update_profile()

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