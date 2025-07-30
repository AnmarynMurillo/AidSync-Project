// profile.js
// Maneja la visualización y edición del perfil de usuario.
// Obtiene los datos del usuario desde el backend y permite actualizar nombre, edad, área y foto de perfil.

// Función para cargar los datos del usuario al cargar la página
async function cargarPerfil() {
    try {
        // Solicita los datos del usuario autenticado al backend
        const res = await fetch('http://localhost:5000/profile', {
            method: 'GET',
            credentials: 'include' // Para enviar cookies si usas sesiones
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('nombre').value = data.user.nombre;
            document.getElementById('edad').value = data.user.edad;
            document.getElementById('area').value = data.user.area;
            document.getElementById('email').value = data.user.email;
            if (data.user.foto_url) {
                document.getElementById('profilePic').src = data.user.foto_url;
            }
        } else {
            document.getElementById('profileMessage').textContent = 'No se pudo cargar el perfil.';
        }
    } catch (err) {
        document.getElementById('profileMessage').textContent = 'Error al conectar con el backend.';
    }
}

// Maneja el envío del formulario para actualizar datos
const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = profileForm.nombre.value;
    const edad = profileForm.edad.value;
    const area = profileForm.area.value;
    // Envía los datos al backend para actualizar
    try {
        const res = await fetch('http://localhost:5000/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ nombre, edad, area })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('profileMessage').style.color = 'green';
            document.getElementById('profileMessage').textContent = 'Perfil actualizado correctamente.';
        } else {
            document.getElementById('profileMessage').textContent = 'Error: ' + data.message;
        }
    } catch (err) {
        document.getElementById('profileMessage').textContent = 'Error al conectar con el backend.';
    }
});

// Maneja el cambio de foto de perfil
const photoForm = document.getElementById('photoForm');
photoForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('photoInput');
    if (!fileInput.files.length) return;
    const formData = new FormData();
    formData.append('foto', fileInput.files[0]);
    // Envía la foto al backend para subirla a Firebase Storage
    try {
        const res = await fetch('http://localhost:5000/profile/photo', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();
        if (data.success && data.foto_url) {
            document.getElementById('profilePic').src = data.foto_url;
            document.getElementById('profileMessage').style.color = 'green';
            document.getElementById('profileMessage').textContent = 'Foto de perfil actualizada.';
        } else {
            document.getElementById('profileMessage').textContent = 'Error: ' + data.message;
        }
    } catch (err) {
        document.getElementById('profileMessage').textContent = 'Error al conectar con el backend.';
    }
});

// Carga el perfil al abrir la página
window.onload = cargarPerfil;
