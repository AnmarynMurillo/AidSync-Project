// profile.js - perfil robusto: backend first -> RTDB REST -> Firebase SDK fallback

// backend por defecto (asegúrate que Flask corre en este host:port)
let firebaseConfig = null;
let backendUrl = null;
let imgbbKey = null; // si no estaba ya definido

async function loadConfig() {
    try {
        // Pedimos la configuración directamente al backend (evita solicitar /api/config
        // al servidor estático que sirve los archivos en otro origen)
        const res = await fetch('/api/config', { credentials: 'include' });
        const cfg = await res.json();
        firebaseConfig = cfg.firebase;
        backendUrl = (cfg.backend && cfg.backend.url) || 'http://localhost:5000';
        imgbbKey = (cfg.imgbb && cfg.imgbb.apiKey) || null;
        initializeFirebase();
    } catch (e) {
        // fallback local mínimo
        firebaseConfig = {
            apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
            authDomain: "expo-project-1040e.firebaseapp.com",
            databaseURL: "https://expo-project-1040e-default-rtdb.firebaseio.com",
            projectId: "expo-project-1040e"
        };
        // conservar backendUrl por defecto si no obtenemos config
        imgbbKey = null;
        initializeFirebase();
    }
}

function initializeFirebase() {
    if (typeof firebase !== 'undefined' && (!firebase.apps || !firebase.apps.length)) {
        firebase.initializeApp(firebaseConfig);
    }
}

function decodeUidFromToken(token) {
    if (!token) return null;
    try { const payload = JSON.parse(atob(token.split('.')[1])); return payload.user_id || payload.uid || null; }
    catch (e) { return null; }
}

async function getStoredIdToken() {
    let token = localStorage.getItem('idToken');
    if (token) return token;
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        try { token = await firebase.auth().currentUser.getIdToken(); localStorage.setItem('idToken', token); return token; } catch (e) {}
    }
    return null;
}

async function fetchProfileBackend(idToken) {
    const res = await fetch(`${backendUrl}/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${idToken}` },
        credentials: 'include'
    });
    if (!res.ok) throw new Error('backend-not-ok');
    const data = await res.json();
    if (!data.success) throw new Error('backend-no-success');
    return data.user;
}

async function fetchProfileRealtimeREST(idToken, uid) {
    if (!firebaseConfig || !firebaseConfig.databaseURL) throw new Error('no-db-url');
    const base = firebaseConfig.databaseURL.replace(/\/$/, '');
    const url = `${base}/users/${uid}.json?auth=${encodeURIComponent(idToken)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('rtdb-rest-failed');
    const val = await res.json();
    if (!val) throw new Error('no-data');
    return {
        uid,
        username: val.username || '',
        nombre: val.nombre || val.name || '',
        edad: val.edad || val.age || '',
        area: val.area || '',
        email: val.email || '',
        accountType: val.accountType || '',
        foto_url: val.foto_url || val.photoURL || '' // <-- incluye foto_url
    };
}

async function fetchProfileFirebaseSDK(uid) {
    const snap = await firebase.database().ref('users/' + uid).once('value');
    const val = snap.val() || {};
    const user = firebase.auth().currentUser;
    return {
        uid,
        username: val.username || '',
        nombre: val.nombre || val.name || (user && user.displayName) || '',
        edad: val.edad || val.age || '',
        area: val.area || '',
        email: val.email || (user && user.email) || '',
        accountType: val.accountType || '',
        foto_url: val.foto_url || (user && user.photoURL) || '' // <-- incluye foto_url
    };
}

function renderProfile(data) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || ''; };
    set('pf-username', data.username || '');
    set('pf-name', data.nombre || '');
    set('pf-age', data.edad || '');
    set('pf-area', data.area || '');
    set('pf-email', data.email || '');
    set('pf-accountType', data.accountType || '');
    const pic = document.getElementById('profilePic');
    if (pic) {
        const fallback = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.photoURL) || '../assets/img/default-profile.png';
        pic.src = data.foto_url || fallback;
    }
}

// ----------------- ImgBB upload helper -----------------
async function uploadToImgBB(file) {
    if (!imgbbKey) throw new Error('No ImgBB key configured');
    // convierte a base64
    const base64 = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result.split(',')[1]);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
    const form = new FormData();
    form.append('image', base64);
    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`;
    const res = await fetch(url, { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok || !data || !data.data) throw new Error('ImgBB upload failed');
    // data.data.display_url or data.data.url
    return data.data.display_url || data.data.url || null;
}

// ----------------- Subida de foto (modificada) -----------------
function setupPhotoUpload() {
    const form = document.getElementById('photoForm');
    if (!form) return;
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const input = document.getElementById('photoInput');
        const msg = document.getElementById('profile-status');
        if (!input || !input.files || !input.files[0]) { if (msg) { msg.textContent='Select a file'; msg.style.color='red'; } return; }
        const file = input.files[0];
        const token = await getStoredIdToken();
        const uid = (token && decodeUidFromToken(token)) || (firebase.auth().currentUser && firebase.auth().currentUser.uid);

        // 1) intenta backend upload (si tienes endpoint y token)
        if (token) {
            try {
                const fd = new FormData();
                fd.append('foto', file);
                const res = await fetch(`${backendUrl}/profile/photo`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include', // <- incluir cookies/sesión para CORS con credenciales
                    body: fd
                });
                const data = await res.json();
                if (res.ok && data.success && data.foto_url) {
                    const pic = document.getElementById('profilePic'); if (pic) pic.src = data.foto_url;
                    // Si tienes firebase session, actualiza Auth & RTDB localmente también
                    try { if (firebase.auth().currentUser) await firebase.auth().currentUser.updateProfile({ photoURL: data.foto_url }); } catch(e){}
                    if (uid && firebase.database) { firebase.database().ref('users/' + uid + '/foto_url').set(data.foto_url).catch(()=>{}); }
                    if (msg) { msg.textContent='Profile picture updated.'; msg.style.color='green'; }
                    return;
                }
            } catch (e) {
                // backend falló: seguimos a ImgBB / Firebase
            }
        }

        // 2) intenta ImgBB (si está configurado)
        if (imgbbKey) {
            try {
                const url = await uploadToImgBB(file);
                if (url) {
                    // actualizar Auth photoURL (si existe sesión) y RTDB
                    try { if (firebase && firebase.auth().currentUser) await firebase.auth().currentUser.updateProfile({ photoURL: url }); } catch(e){}
                    if (uid && firebase.database) {
                        try { await firebase.database().ref('users/' + uid + '/foto_url').set(url); } catch(e){}
                    }
                    const pic = document.getElementById('profilePic'); if (pic) pic.src = url;
                    if (msg) { msg.textContent='Profile picture uploaded to ImgBB.'; msg.style.color='green'; }
                    return;
                }
            } catch (e) {
                console.warn('ImgBB upload failed:', e);
            }
        }

        // 3) fallback Firebase Storage
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.storage) {
            try {
                const user = firebase.auth().currentUser;
                const uid2 = user.uid;
                const ref = firebase.storage().ref().child(`profile_pics/${uid2}/${file.name}`);
                const snapshot = await ref.put(file);
                const url = await snapshot.ref.getDownloadURL();
                await user.updateProfile({ photoURL: url });
                // guardar en RTDB
                try { await firebase.database().ref('users/' + uid2 + '/foto_url').set(url); } catch(e){}
                const pic = document.getElementById('profilePic'); if (pic) pic.src = url;
                if (msg) { msg.textContent='Profile picture updated (Firebase).'; msg.style.color='green'; }
                return;
            } catch (e) {
                if (msg) { msg.textContent='Failed to upload photo.'; msg.style.color='red'; }
            }
        } else {
            if (msg) { msg.textContent='No upload method available.'; msg.style.color='red'; }
        }
    });
}

const BACKEND_TIMEOUT = 3000;

function timeoutFetch(resource, options = {}, timeout = BACKEND_TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const signal = controller.signal;
    return fetch(resource, { ...options, signal })
        .finally(() => clearTimeout(id));
}

async function tryFetchProfileBackend(idToken) {
    if (!backendUrl || !idToken) throw new Error('no-backend-or-token');
    try {
        const res = await timeoutFetch(`${backendUrl}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${idToken}` },
            credentials: 'include'
        }, BACKEND_TIMEOUT);
        // Si status 401/403 -> no session, no intentos adicionales con backend
        if (res.status === 401 || res.status === 403) {
            const msg = document.getElementById('profileMessage');
            if (msg) { msg.textContent = 'Backend: not authenticated (session expired).'; msg.style.color = 'red'; }
            throw new Error('unauthenticated');
        }
        if (!res.ok) {
            throw new Error(`backend-error-${res.status}`);
        }
        const data = await res.json();
        if (!data.success) throw new Error('backend-no-success');
        return data.user;
    } catch (err) {
        // Diferencia entre fallo de red/timeout y rechazo por autorización
        console.warn('Backend profile fetch failed:', err);
        throw err;
    }
}

async function mainLoadProfile() {
    // carga config e inicializa firebase (ya implementadas)
    await loadConfig();
    initializeFirebase();
    const msgEl = document.getElementById('profile-status');
    if (msgEl) { msgEl.textContent = 'Loading profile...'; msgEl.style.color = ''; }

    // Espera breve a que firebase auth se inicialice si aplica
    if (typeof firebase !== 'undefined' && firebase.auth) {
        await new Promise((resolve) => {
            const unsub = firebase.auth().onAuthStateChanged(() => { unsub(); resolve(); });
            setTimeout(resolve, 1200);
        });
    }

    // Obtén token/uid
    const idToken = await getStoredIdToken();
    const uidStored = localStorage.getItem('uid') || (idToken ? decodeUidFromToken(idToken) : null);

    // 1) Backend (intento principal)
    if (idToken) {
        try {
            const backendData = await tryFetchProfileBackend(idToken);
            renderProfile(backendData);
            if (msgEl) { msgEl.textContent = 'Profile loaded from backend.'; msgEl.style.color = 'green'; }
            return;
        } catch (err) {
            // Si la razón fue "unauthenticated", no intentar REST con token probablemente inválido.
            if (err.message === 'unauthenticated') {
                // continuar con fallback sin mostrar error repeat
            } else {
                // Backend no disponible o fallo -> continuar con fallback
                if (msgEl) { msgEl.textContent = 'Backend not available, trying Firebase...'; msgEl.style.color = 'orange'; }
            }
        }
    } else {
        if (msgEl) { msgEl.textContent = 'No backend token found, trying Firebase...'; msgEl.style.color = 'orange'; }
    }

    // 2) RTDB REST con idToken + uid
    if (idToken && uidStored) {
        try {
            const rtdbUser = await fetchProfileRealtimeREST(idToken, uidStored);
            renderProfile(rtdbUser);
            if (msgEl) { msgEl.textContent = 'Profile loaded from Firebase (REST).'; msgEl.style.color = 'green'; }
            return;
        } catch (err) {
            console.warn('RTDB REST failed:', err);
            // continuar a SDK
        }
    }

    // 3) Firebase SDK fallback (si sesión cliente)
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        try {
            const uid = firebase.auth().currentUser.uid;
            const sdkUser = await fetchProfileFirebaseSDK(uid);
            renderProfile(sdkUser);
            if (msgEl) { msgEl.textContent = 'Profile loaded from Firebase (SDK).'; msgEl.style.color = 'green'; }
            return;
        } catch (err) {
            console.warn('Firebase SDK fetch failed:', err);
        }
    }

    // 4) Nada funcionó
    if (msgEl) { msgEl.textContent = 'You must log in to view your profile.'; msgEl.style.color = 'red'; }
    // limpieza visual
    const clearIds = ['nombre','edad','area','email'];
    clearIds.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
    const pic = document.getElementById('profilePic'); if (pic) pic.src = '../assets/img/default-profile.png';
}

// Asegúrate de usar mainLoadProfile() en DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    await mainLoadProfile();
    // Suscripción en tiempo real a cambios de perfil mientras la sesión esté activa
    try {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(async (user) => {
                const msgEl = document.getElementById('profile-status');
                if (user && firebase.database) {
                    const ref = firebase.database().ref('users/' + user.uid);
                    ref.off();
                    ref.on('value', (snap) => {
                        const val = snap.val();
                        if (val) {
                            renderProfile({
                                uid: user.uid,
                                username: val.username || '',
                                nombre: val.nombre || val.name || (user.displayName || ''),
                                edad: val.edad || val.age || '',
                                area: val.area || '',
                                email: val.email || (user.email || ''),
                                accountType: val.accountType || '',
                                foto_url: val.foto_url || user.photoURL || ''
                            });
                            if (msgEl) { msgEl.textContent = ''; }
                        }
                    });
                } else {
                    if (msgEl) { msgEl.textContent = 'You must log in to view your profile.'; msgEl.style.color = 'red'; }
                }
            });
        }
    } catch (e) { /* ignore */ }
    setupPhotoUpload(); // función existente que maneja backend/imgbb/firebase
});


