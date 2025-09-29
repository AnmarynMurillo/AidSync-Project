// Configuración de Firebase JS para fallback si el backend falla
// Importar configuración
import { currentConfig } from './config.js';

// Las configuraciones se cargan desde el backend de forma segura
let firebaseConfig = null;

// Usar la configuración actual
const backendUrl = currentConfig.backendUrl + currentConfig.apiPrefix;

async function loadConfig() {
    try {
        const response = await fetch(`${currentConfig.backendUrl}/api/config`);
        const config = await response.json();
        firebaseConfig = config.firebase;
        console.log('✅ Configuraciones cargadas desde backend');
        initializeFirebase();
    } catch (error) {
        console.error('Error cargando configuraciones:', error);
        // Configuración de respaldo
        firebaseConfig = {
            apiKey: "AIzaSyC9Qx2G3K0Q8Q9XQ4Q5Q6Q7Q8Q9Q0Q1Q2Q",
            authDomain: "expo-project-1040e.firebaseapp.com",
            projectId: "expo-project-1040e"
        };
        
        // Inicializar Firebase
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            initializeFirebase();
        }
    }
}

// Manejo del formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuraciones al cargar la página
    loadConfig();
    
    const form = document.getElementById('registerForm');
    const msg = document.getElementById('registerMessage');
    const submitBtn = form?.querySelector('.register-btn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        msg.textContent = '';
        msg.classList.remove('error','success');
        submitBtn && (submitBtn.disabled = true, submitBtn.classList.add('is-loading'));

        // Obtiene los valores del formulario
        const name = form.name.value;
        const age = form.age.value;
        const email = form.email.value;             // moved up in form
        const username = form.username.value;       // NEW
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const area = form.area.value;
        const accountType = form.accountType.value;

        // Validación básica en el frontend
        if (password !== confirmPassword) {
            msg.textContent = 'Passwords do not match';
            msg.classList.remove('success'); msg.classList.add('error');
            submitBtn && (submitBtn.disabled = false, submitBtn.classList.remove('is-loading'));
            return;
        }
        // Usa la URL del backend cargada desde configuraciones
        let registerUrl = `${backendUrl}/register`;
        // Intenta registrar usando el backend (Python)
        try {
            const res = await fetch(`${backendUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  name, age, email, username, password, area, accountType   // NEW: username included
                })
            });
            const data = await res.json();
            if (data.success) {
                msg.textContent = 'Successful register. Redirecting...';
                msg.classList.remove('error'); msg.classList.add('success');
                // NEW: usar autoLogin del backend si viene
                if (data.autoLogin && data.redirect) {
                    return setTimeout(() => window.location.assign(data.redirect), 600);
                }
                // fallback si no viene redirect
                return setTimeout(() => window.location.assign('login.html'), 1500);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            // Si el backend falla, intenta con Firebase JS
            msg.textContent = 'Trying to register with Firebase...';
            msg.classList.remove('error','success');
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
                        nombre: name,
                        username,
                        email,
                        edad: age,
                        area,
                        accountType
                    });
                }
                // Obtener token/uid tras registrar (para que Profile cargue de inmediato)
                try {
                    const token = await userCredential.user.getIdToken();
                    localStorage.setItem('idToken', token);
                    const uid = (function(t){ try{const p=JSON.parse(atob(t.split('.')[1])); return p.user_id||p.uid||null;}catch(_){return null;} })(token);
                    if (uid) localStorage.setItem('uid', uid);
                } catch(_){}
                msg.textContent = 'Successful register. Redirecting...';
                msg.classList.remove('error'); msg.classList.add('success');
                setTimeout(() => window.location.assign('../public/pages/profile.html'), 1000);
            } catch (firebaseErr) {
                msg.textContent = 'Error: ' + firebaseErr.message;
                msg.classList.remove('success'); msg.classList.add('error');
            }
        }
        // Always clear loading state unless redirected
        submitBtn && (submitBtn.disabled = false, submitBtn.classList.remove('is-loading'));
    });
});
