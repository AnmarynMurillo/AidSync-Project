# firebase_auth.py
# Inicializa Firebase Admin SDK usando la configuración del archivo JSON
import firebase_admin
from firebase_admin import credentials, auth
import os

# Ruta al archivo de configuración (ajustada para la estructura actual)
FIREBASE_CONFIG_PATH = os.path.join(os.path.dirname(__file__), '../../firebase_config.json')

# Inicialización global (solo si no está ya inicializado)
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CONFIG_PATH)
    firebase_admin.initialize_app(cred, {
        'storageBucket': '<TU_BUCKET>.appspot.com'  # Reemplaza por tu bucket real si usas storage
    })
