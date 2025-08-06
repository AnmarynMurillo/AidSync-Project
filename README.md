# AidSync Project

## Setup

1. Clone the repository
2. Search the email sent before with the .env file then move it to the directory of the proyect.
3. Install dependencies: `pip install -r backend/requirements.txt`
4. Run backend: `python backend/app.py`
5. Open frontend in browser

## Environment Variables
'# ========================================
# ========================================
# VARIABLES DE ENTORNO - AIDSYNC PROJECT
# ========================================
# leer:
# Importar la configuración de variables de entorno desde un archivo .env
# en el onedrive del grupo se encontraran los archivos y la configuración .env para que el backend funcione de manera correcta en el repositorio de todos.

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com

# Flask Configuration
SECRET_KEY=your_secret_key_here
DEBUG=True
FLASK_ENV=development

# Backend URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5500

# API Keys (si usas servicios externos)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here'