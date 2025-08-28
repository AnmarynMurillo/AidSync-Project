// login.js - Login híbrido: backend Python primero, luego Firebase v8 como fallback

// ================================
// 1. CARGAR CONFIGURACIONES DESDE BACKEND
// ================================
let firebaseConfig = null;
let backendUrl = null;

// Helper global para decodificar uid desde el idToken (JWT)
function decodeUidFromJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.uid || null;
  } catch {
    return null;
  }
}

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
            databaseURL: "https://expo-project-1040e-default-rtdb.firebaseio.com",
            projectId: "expo-project-1040e",
            storageBucket: "expo-project-1040e.firebasestorage.app",
            messagingSenderId: "813329495011",
            appId: "1:813329495011:web:931d42531c471fe3e2e6d6",
            measurementId: "G-QY0VQSB12F"
        };
        backendUrl = 'http://localhost:5000';
        initializeFirebase();
    }
}

// ================================
// 2. INICIALIZAR FIREBASE
// ================================
function initializeFirebase() {
  // evita inicializar si no hay config aún
  if (!firebaseConfig) return;
  if (typeof firebase !== 'undefined' && (!firebase.apps || !firebase.apps.length)) {
    firebase.initializeApp(firebaseConfig);
  }
}

// ================================
// 3. INTENTO DE LOGIN CON FLASK
// ================================
async function tryPythonLogin(email, password, timeout = 2000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timer);
        const data = await res.json();
        return { success: data.success, message: data.message, idToken: data.idToken };
    } catch (err) {
        clearTimeout(timer);
        console.warn('⚠️ Python login failed or timed out:', err);
        return { success: false, message: err.message };
    }
}

// ================================
// 4. LOGIN VÍA FIREBASE (FALLBACK)
// ================================
async function tryFirebaseLogin(email, password) {
    try {
        const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('✅ Firebase login success:', userCred.user.email);
        return { success: true, user: userCred.user };
    } catch (err) {
        console.error('❌ Firebase login error:', err.code, err.message);
        return { success: false, message: err.code || err.message };
    }
}

// ================================
// 5. MANEJADOR DEL FORMULARIO
// ================================
document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuraciones al cargar la página
    loadConfig();

    // Conecta con los IDs reales del formulario en login.html
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const status = document.getElementById('login-status');
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-pass').value;

            if (!email || !password) {
                status.textContent = 'Please fill in all fields';
                status.classList.remove('success');
                status.classList.add('error');
                return;
            }
            status.textContent = 'Logging in...';
            status.classList.remove('error', 'success');

            // 1) Intento con Python backend
            console.log('▶️ Trying backend login...');
            const pythonRes = await tryPythonLogin(email, password);
            if (pythonRes.success) {
                console.log('✅ Backend login OK');
                // Guarda idToken/uid si vienen del backend
                if (pythonRes.idToken) {
                    localStorage.setItem('idToken', pythonRes.idToken);
                    try { const uid = decodeUidFromJwt(pythonRes.idToken); if (uid) localStorage.setItem('uid', uid); } catch(e){}
                }
                localStorage.setItem('user', JSON.stringify({ email }));
                status.textContent = 'Login successful! Redirecting...';
                status.classList.remove('error');
                status.classList.add('success');
                setTimeout(() => { window.location.href = '/public/pages/profile.html'; }, 800);
                return;
            }

            // 2) Fallback a Firebase: espera inicialización
            status.textContent = 'Trying Firebase login...';
            await waitForFirebaseInit(3000);
            const firebaseRes = await tryFirebaseLogin(email, password);
            if (firebaseRes.success) {
                // obtiene token de Firebase y guarda uid
                try {
                    const token = await firebaseRes.user.getIdToken();
                    localStorage.setItem('idToken', token);
                    const uid = decodeUidFromJwt(token);
                    if (uid) localStorage.setItem('uid', uid);
                } catch (e) { console.warn('No idToken from firebase:', e); }
                localStorage.setItem('user', JSON.stringify({ email: firebaseRes.user.email }));
                status.textContent = 'Login successful! Redirecting...';
                status.classList.remove('error');
                status.classList.add('success');
                setTimeout(() => { window.location.href = '/public/pages/profile.html'; }, 800);
            } else {
                // Mensajes bonitos y amigables para el usuario
                let msg = '';
                switch (firebaseRes.message) {
                    case 'auth/user-not-found':
                        msg = 'The email is not registered.';
                        break;
                    case 'auth/wrong-password':
                        msg = 'Wrong password.';
                        break;
                    case 'auth/invalid-email':
                        msg = 'Invalid mail format.';
                        break;
                    case 'app/no-app':
                        msg = 'There was a problem with the connection. Try again.';
                        break;
                    default:
                        msg = 'Failed to login. Please check your credentials and try again.';
                }
                status.textContent = msg;
                status.classList.remove('success');
                status.classList.add('error');
                console.error('❌ Firebase login error:', firebaseRes.message);
            }
        });
    } else {
        console.error('❌ Login form not found in the DOM');
    }
});

// agrega helper para esperar inicialización de Firebase
function waitForFirebaseInit(timeout = 3000) {
  return new Promise((resolve) => {
    const start = Date.now();
    (function check() {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) return resolve(true);
      if (Date.now() - start > timeout) return resolve(false);
      setTimeout(check, 100);
    })();
  });
}

// ================================
// 6. POPUP DE LOGOUT (sin cambio)
// ================================
function showLogoutPopup() {
  const popup = document.createElement('div');
  popup.className = 'logout-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Are you sure you want to logout?</h3>
      <div class="popup-buttons">
        <button id="confirm-logout">Yes, logout</button>
        <button id="cancel-logout">Go back to index</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Event listeners para los botones
  popup.querySelector('#confirm-logout').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('user');
        // FIX: usar la función correctamente
        window.location.assign('/index.html');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      popup.remove();
    }
  });

  popup.querySelector('#cancel-logout').addEventListener('click', () => {
    popup.remove();
  });
}

// Estilos CSS para el popup
const style = document.createElement('style');
style.textContent = `
  .logout-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
  }

  .popup-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .popup-buttons button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  #confirm-logout {
    background-color: #dc3545;
    color: white;
  }

  #cancel-logout {
    background-color: #6c757d;
    color: white;
  }
`;
document.head.appendChild(style);