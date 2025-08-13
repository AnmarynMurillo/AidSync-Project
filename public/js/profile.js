// profile.js
// Maneja la visualización y edición del perfil de usuario.
// Obtiene los datos del usuario desde el backend y permite actualizar nombre, edad, área y foto de perfil.

// Configuración para fallback a Firebase si el backend falla
let backendUrl = 'http://localhost:5000'; // Puedes cargar esto dinámicamente si lo prefieres

// Helper para obtener UID de usuario autenticado en Firebase
function getFirebaseUid() {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
        return firebase.auth().currentUser.uid;
    }
    return null;
}

// Función para obtener el ID Token de Firebase Auth
async function getIdToken() {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
        // Fuerza la obtención de un token nuevo
        return await firebase.auth().currentUser.getIdToken(true);
    }
    return null;
}

// Función para cargar los datos del usuario al cargar la página
async function cargarPerfil() {
    try {
        const idToken = await getIdToken();
        const headers = idToken
            ? { 'Authorization': 'Bearer ' + idToken }
            : {};
        // Solicita los datos del usuario autenticado al backend
        const res = await fetch(`${backendUrl}/profile`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('nombre').textContent = data.user.nombre;
            document.getElementById('edad').textContent = data.user.edad;
            document.getElementById('area').textContent = data.user.area;
            document.getElementById('email').textContent = data.user.email;
            if (data.user.foto_url) {
                document.getElementById('profilePic').src = data.user.foto_url;
            }
        } else {
            throw new Error('No se pudo cargar el perfil.');
        }
    } catch (err) {
        // Fallback: intenta obtener datos desde Firebase Auth y Database
        if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            document.getElementById('nombre').textContent = user.displayName || '';
            document.getElementById('email').textContent = user.email || '';
            if (user.photoURL) {
                document.getElementById('profilePic').src = user.photoURL;
            }
            // Lee edad y área desde Firebase Database
            const uid = getFirebaseUid();
            if (uid && firebase.database) {
                firebase.database().ref('users/' + uid).once('value').then(snapshot => {
                    const val = snapshot.val();
                    document.getElementById('edad').textContent = val && val.edad ? val.edad : '';
                    document.getElementById('area').textContent = val && val.area ? val.area : '';
                });
            } else {
                document.getElementById('edad').textContent = '';
                document.getElementById('area').textContent = '';
            }
            document.getElementById('profileMessage').textContent = 'Perfil cargado desde Firebase (modo fallback).';
        } else {
            document.getElementById('profileMessage').textContent = 'Error al conectar con el backend y Firebase.';
        }
    }
}

// Maneja el cambio de foto de perfil
const photoForm = document.getElementById('photoForm');
if (photoForm) {
    photoForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('photoInput');
        if (!fileInput.files.length) return;
        const formData = new FormData();
        formData.append('foto', fileInput.files[0]);
        try {
            const idToken = await getIdToken();
            const headers = idToken ? { 'Authorization': 'Bearer ' + idToken } : {};
            const res = await fetch(`${backendUrl}/profile/photo`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success && data.foto_url) {
                document.getElementById('profilePic').src = data.foto_url;
                document.getElementById('profileMessage').style.color = 'green';
                document.getElementById('profileMessage').textContent = 'Foto de perfil actualizada.';
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            // Fallback: subir la foto a Firebase Storage y actualizar photoURL en Auth
            if (typeof firebase !== 'undefined' && firebase.auth().currentUser && firebase.storage) {
                try {
                    const user = firebase.auth().currentUser;
                    const uid = user.uid;
                    const file = fileInput.files[0];
                    // Crea una referencia en Storage
                    const storageRef = firebase.storage().ref();
                    const profilePicRef = storageRef.child(`profile_pics/${uid}/${file.name}`);
                    // Sube el archivo
                    const snapshot = await profilePicRef.put(file);
                    // Obtiene la URL pública
                    const url = await snapshot.ref.getDownloadURL();
                    // Actualiza el photoURL en Auth
                    await user.updateProfile({ photoURL: url });
                    document.getElementById('profilePic').src = url;
                    document.getElementById('profileMessage').style.color = 'green';
                    document.getElementById('profileMessage').textContent = 'Foto de perfil actualizada en Firebase (modo fallback).';
                } catch (firebaseErr) {
                    document.getElementById('profileMessage').style.color = 'red';
                    document.getElementById('profileMessage').textContent = 'Error al subir la foto a Firebase: ' + firebaseErr.message;
                }
            } else {
                document.getElementById('profileMessage').style.color = 'red';
                document.getElementById('profileMessage').textContent = 'Error al conectar con el backend y Firebase.';
            }
        }
    });
}

// Carga el perfil al abrir la página
window.onload = cargarPerfil;
