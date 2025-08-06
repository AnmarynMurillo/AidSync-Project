from flask import Flask, request, jsonify, session
import src.auth.firebase_auth
from src.users.user_service import register_user, login_user, get_profile, update_profile, update_photo
from flask_cors import CORS
from firebase_admin import auth as firebase_auth, storage
import traceback
import os
import re
import logging
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Habilita CORS para todas las rutas
app.secret_key = os.environ.get('SECRET_KEY', 'supersecretkey')  # Necesario para sesiones

# Configura logging para mejor trazabilidad
logging.basicConfig(level=logging.INFO)

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
        }
    })

# Rutas de usuario (la lógica está en user_service.py)
app.add_url_rule('/register', view_func=register_user, methods=['POST'])
app.add_url_rule('/login', view_func=login_user, methods=['POST'])
app.add_url_rule('/profile', view_func=get_profile, methods=['GET'])
app.add_url_rule('/profile/update', view_func=update_profile, methods=['POST'])
app.add_url_rule('/profile/photo', view_func=update_photo, methods=['POST'])

if __name__ == "__main__":
    app.run(debug=True)