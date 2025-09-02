// Configuración de Firebase JS para fallback si el backend falla
// Las configuraciones se cargan desde el backend de forma segura

let firebaseConfig = null;
let backendUrl = null;

async function loadConfig() {
    try {
        const response = await fetch('http://localhost:5000/api/config');
        const config = await response.json();
        firebaseConfig = config.firebase;
        backendUrl = config.backend.url;
        console.log('✅ Configuraciones cargadas desde backend');
        initializeFirebase();
    } catch (error) {
        console.warn('⚠️ No se pudo cargar configuraciones del backend, usando valores por defecto');
        // Configuración por defecto (fallback)
        // Firebase v8
        firebaseConfig = {
            apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
            authDomain: "expo-project-1040e.firebaseapp.com",
            projectId: "expo-project-1040e",
        };
        backendUrl = 'http://localhost:5000';
        initializeFirebase();
    }
}

function initializeFirebase() {
    if (typeof firebase !== 'undefined' && firebase.apps && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

// Manejo del formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuraciones al cargar la página
    loadConfig();
    
    const form = document.getElementById('registerForm');
    const msg = document.getElementById('registerMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        msg.textContent = '';
        // Obtiene los valores del formulario
        const name = form.name.value;
        const age = form.age.value;
        const area = form.area.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        // Validación básica en el frontend
        if (password !== confirmPassword) {
            msg.textContent = 'Passwords do not match';
            msg.style.color = 'red';
            return;
        }
        // Usa la URL del backend cargada desde configuraciones
        let registerUrl = `${backendUrl}/register`;
        // Intenta registrar usando el backend (Python)
        try {
            const res = await fetch(registerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name,age,area,email, password})
            });
            const data = await res.json();
            if (data.success) {
                msg.style.color = 'green';
                msg.textContent = 'Successfull Register, Redirecting...';
                setTimeout(() => window.location.assign('login.html'), 1500);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            // Si el backend falla, intenta con Firebase JS
            msg.textContent = 'Trying to register with Firebase...';
            try {
                // Verifica si el correo ya existe en Firebase Auth antes de crear la cuenta
                let exists = false;
                try {
                    // Firebase v8 no tiene getUserByEmail en JS, así que intentamos crear y capturamos el error
                    await firebase.auth().createUserWithEmailAndPassword(email, password);
                } catch (firebaseErr) {
                    if (firebaseErr.code === 'auth/email-already-in-use') {
                        exists = true;
                        msg.textContent = 'This email is already registered in Firebase.';
                        msg.style.color = 'red';
                        return;
                    } else {
                        throw firebaseErr;
                    }
                }
                // Si no existe, el usuario ya fue creado arriba
                const userCredential = firebase.auth().currentUser
                    ? { user: firebase.auth().currentUser }
                    : await firebase.auth().signInWithEmailAndPassword(email, password);

                await userCredential.user.updateProfile({ displayName: name });
                // Guardar datos extra en Realtime Database
                if (firebase.database) {
                    await firebase.database().ref('users/' + userCredential.user.uid).set({
                        edad: age,
                        area,
                        email,
                        nombre: name
                    });
                }
                msg.style.color = 'green';
                msg.textContent = 'Succesfull Register, Redirecting...';
                setTimeout(() => window.location.assign('/public/pages/login.html'), 1500);
            } catch (firebaseErr) {
                msg.textContent = 'Error: ' + firebaseErr.message;
                msg.style.color = 'red';
            }
        }
    });
});
