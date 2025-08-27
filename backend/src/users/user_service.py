# user_service.py
# Lógica de usuario: registro, login seguro, perfil y actualización

from flask import request, jsonify
from firebase_admin import auth as firebase_auth, storage, db
from src.database.firestore_service import db as firestore_db
import requests
import logging
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de la REST API de Firebase para login seguro
FIREBASE_API_KEY = os.environ.get('FIREBASE_API_KEY', 'AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo')
FIREBASE_AUTH_URL = f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}'

# Validaciones básicas
import re
def is_valid_email(email):
    """Valida formato de email."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_strong_password(password):
    """Valida que la contraseña sea fuerte."""
    return (
        isinstance(password, str) and
        len(password) >= 6 and
        re.search(r"[A-Z]", password) and
        re.search(r"[a-z]", password) and
        re.search(r"\d", password)
    )

def register_user():
    """
    Registra un nuevo usuario en Firebase Auth y guarda datos extra en Firestore.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"success": False, "message": "No se recibieron datos"}), 400

        # Acepta claves en español e inglés desde el frontend
        nombre = (data.get("nombre") or data.get("name") or "").strip()
        edad = data.get("edad") if "edad" in data else data.get("age")
        area = (data.get("area") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password", "")

        # Validaciones estrictas
        if not all([nombre, edad, area, email, password]):
            return jsonify({"success": False, "message": "Faltan datos obligatorios"}), 400
        if not is_valid_email(email):
            return jsonify({"success": False, "message": "Correo electrónico inválido"}), 400
        if not is_strong_password(password):
            return jsonify({"success": False, "message": "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número"}), 400
        try:
            edad_int = int(edad)
            if edad_int < 12 or edad_int > 120:
                return jsonify({"success": False, "message": "Edad fuera de rango permitido"}), 400
        except Exception:
            return jsonify({"success": False, "message": "Edad inválida"}), 400

        # Evita registros duplicados
        try:
            firebase_auth.get_user_by_email(email)
            return jsonify({"success": False, "message": "El correo ya está registrado"}), 409
        except firebase_auth.UserNotFoundError:
            pass  # OK, no existe

        # Crear usuario en Firebase Auth
        user = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=nombre
        )
        # Guardar datos extra en Firestore (opcional)
        # from src.database.firestore_service import db
        # db.collection('users').document(user.uid).set({
        #     'nombre': nombre, 'edad': edad_int, 'area': area, 'email': email
        # })

        # Guardar datos extra en Realtime Database (schema consistente en español)
        try:
            db.reference(f'users/{user.uid}').set({
                'nombre': nombre,
                'edad': edad_int,
                'area': area,
                'email': email
            })
        except Exception as db_err:
            logging.warning(f"No se pudo guardar en Realtime Database: {db_err}")

        logging.info("Usuario registrado: %s", email)
        return jsonify({"success": True, "message": "Usuario registrado correctamente"}), 201
    except Exception as e:
        logging.error("Error en /register: %s", e)
        return jsonify({"success": False, "message": "Error interno del servidor"}), 500

def login_user():
    """
    Login seguro usando la REST API de Firebase para validar email y contraseña.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"success": False, "message": "No se recibieron datos"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not all([email, password]):
            return jsonify({"success": False, "message": "Faltan datos"}), 400
        if not is_valid_email(email):
            return jsonify({"success": False, "message": "Correo electrónico inválido"}), 400

        # Usar la REST API de Firebase para validar email y contraseña
        payload = {
            'email': email,
            'password': password,
            'returnSecureToken': True
        }
        resp = requests.post(FIREBASE_AUTH_URL, json=payload)
        if resp.status_code != 200:
            return jsonify({"success": False, "message": "Credenciales inválidas"}), 401
        id_token = resp.json().get('idToken')
        logging.info("Usuario autenticado: %s", email)
        return jsonify({"success": True, "message": "Login exitoso", "idToken": id_token}), 200
    except Exception as e:
        logging.error("Error en /login: %s", e)
        return jsonify({"success": False, "message": "Error interno del servidor"}), 500

def get_profile():
    """
    Devuelve el perfil del usuario autenticado usando el ID Token.
    """
    try:
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"success": False, "message": "No token provided"}), 401
        id_token = auth_header.split(' ')[1]
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        user = firebase_auth.get_user(uid)
        # Intenta primero desde Realtime Database (según requerimiento)
        rt_data = {}
        try:
            rt_ref = db.reference(f'users/{uid}')
            rt_data = rt_ref.get() or {}
        except Exception as rt_err:
            logging.warning("No se pudo obtener datos de Realtime DB: %s", rt_err)

        # Obtén datos extra de Firestore (fallback opcional)
        extra = {}
        try:
            doc = firestore_db.collection('users').document(uid).get()
            extra = doc.to_dict() if doc.exists else {}
        except Exception as fs_err:
            logging.warning("No se pudo obtener datos de Firestore: %s", fs_err)

        nombre = (
            rt_data.get("name") or
            rt_data.get("nombre") or
            extra.get("nombre") or
            (user.display_name or "")
        )
        edad = (
            rt_data.get("age") or
            rt_data.get("edad") or
            extra.get("edad") or
            0
        )
        area = (
            rt_data.get("area") or
            extra.get("area") or
            ""
        )
        email = (
            rt_data.get("email") or
            user.email
        )

        user_data = {
            "uid": uid,
            "nombre": nombre,
            "edad": edad,
            "area": area,
            "email": email,
            "foto_url": user.photo_url or None
        }
        return jsonify({"success": True, "user": user_data}), 200
    except Exception as e:
        logging.error("Error en /profile: %s", e)
        return jsonify({"success": False, "message": "Error interno del servidor"}), 500

def update_profile():
    """
    Actualiza el perfil del usuario autenticado (nombre, edad, área).
    """
    try:
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"success": False, "message": "No token provided"}), 401
        id_token = auth_header.split(' ')[1]
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"success": False, "message": "No se recibieron datos"}), 400
        nombre = data.get("nombre", "").strip()
        edad = data.get("edad")
        area = data.get("area", "").strip()
        if not nombre:
            return jsonify({"success": False, "message": "Nombre requerido"}), 400
        firebase_auth.update_user(uid, display_name=nombre)
        # Actualiza edad y área en Firestore
        firestore_db.collection('users').document(uid).set({
            "edad": edad,
            "area": area
        }, merge=True)
        logging.info("Perfil actualizado para: %s", uid)
        return jsonify({"success": True, "message": "Perfil actualizado"}), 200
    except Exception as e:
        logging.error("Error en /profile/update: %s", e)
        return jsonify({"success": False, "message": "Error interno del servidor"}), 500

def update_photo():
    """
    Sube o actualiza la foto de perfil del usuario autenticado.
    """
    try:
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"success": False, "message": "No token provided"}), 401
        id_token = auth_header.split(' ')[1]
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        if 'foto' not in request.files:
            return jsonify({"success": False, "message": "No se envió archivo"}), 400
        file = request.files['foto']
        if file.filename == '':
            return jsonify({"success": False, "message": "Nombre de archivo vacío"}), 400
        user = firebase_auth.get_user(uid)
        bucket = storage.bucket()
        blob = bucket.blob(f'profile_pics/{uid}.jpg')
        blob.upload_from_file(file, content_type=file.content_type)
        blob.make_public()
        photo_url = blob.public_url
        firebase_auth.update_user(uid, photo_url=photo_url)
        logging.info("Foto de perfil actualizada para: %s", uid)
        return jsonify({"success": True, "foto_url": photo_url}), 200
    except Exception as e:
        logging.error("Error en /profile/photo: %s", e)
        return jsonify({"success": False, "message": "Error interno del servidor"}), 500