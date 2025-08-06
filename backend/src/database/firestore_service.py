# firestore_service.py
# Lógica de base de datos para Firestore

import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import jsonify

# Inicializar Firebase solo si no está inicializado
if not firebase_admin._apps:
    cred = credentials.Certificate('backend/firebase_config.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ------------------- SERVICIO DE MASCOTAS (EJEMPLO) -------------------

def create_pet_for_user(request):
    """
    Crea una mascota para el usuario autenticado:
    1. Verifica el ID Token enviado en el header Authorization.
    2. Si es válido, crea una mascota en la colección 'pets' con el owner_id del usuario.
    """
    try:
        data = request.json
        # Obtener el token del header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        # Crear documento en Firestore
        pet_ref = db.collection('pets').document()
        pet_ref.set({
            'name': data['name'],
            'type': data['type'],
            'owner_id': decoded_token['uid'],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return jsonify({'message': 'Mascota creada exitosamente', 'id': pet_ref.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_user_pets(request):
    """
    Obtiene las mascotas del usuario autenticado:
    1. Verifica el ID Token enviado en el header Authorization.
    2. Si es válido, obtiene todas las mascotas de ese usuario.
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        pets = db.collection('pets').where('owner_id', '==', decoded_token['uid']).stream()
        pets_list = [{'id': pet.id, **pet.to_dict()} for pet in pets]
        return jsonify(pets_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
