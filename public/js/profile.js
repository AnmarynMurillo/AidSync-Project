// profile.js - perfil robusto: backend first -> RTDB REST -> Firebase SDK fallback

// backend por defecto (asegúrate que Flask corre en este host:port)
let firebaseConfig = null;
let backendUrl = null;
let imgbbKey = null;
// Default ImgBB API key and resolver
const DEFAULT_IMGBB_KEY = '1e66bbbd585957283148f799c1a73de4';
function resolveImgBBKey() {
	try {
		return window.__IMGBB_KEY || localStorage.getItem('as_imgbb_key') || DEFAULT_IMGBB_KEY;
	} catch (_) {
		return DEFAULT_IMGBB_KEY;
	}
}

// Resolve backend URL reliably (dev fallback)
function resolveDefaultBackend() {
    // Allow overriding via window.__BACKEND_URL or localStorage
    return window.__BACKEND_URL || localStorage.getItem('as_backend_url') || 'http://localhost:5000';
}

async function loadConfig() {
    try {
        const defaultBackend = resolveDefaultBackend();
        // Always hit Flask backend for config (not the static server on 127.0.0.1:5500)
        const res = await fetch(`${defaultBackend}/api/config`, { credentials: 'include' });
        const cfg = await res.json();
        firebaseConfig = cfg.firebase;
        backendUrl = (cfg.backend && cfg.backend.url) || defaultBackend;
        imgbbKey = (cfg.imgbb && cfg.imgbb.apiKey) || resolveImgBBKey(); // use resolver fallback
        initializeFirebase();
    } catch (e) {
        // Use window.firebaseConfig if available, otherwise use fallback
        firebaseConfig = window.firebaseConfig || {
            apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
            authDomain: "expo-project-1040e.firebaseapp.com",
            databaseURL: "https://expo-project-1040e-default-rtdb.firebaseio.com",
            projectId: "expo-project-1040e",
            storageBucket: "expo-project-1040e.appspot.com" // <-- ensure default bucket on fallback
        };
        backendUrl = resolveDefaultBackend(); // <= FIX: never leave it null
        imgbbKey = resolveImgBBKey(); // ensure ImgBB key is set on fallback
        initializeFirebase();
    }
}

function initializeFirebase() {
    // Ensure storageBucket if missing but projectId available
    if (firebaseConfig && !firebaseConfig.storageBucket && firebaseConfig.projectId) {
        firebaseConfig.storageBucket = `${firebaseConfig.projectId}.appspot.com`;
    }
    if (typeof firebase !== 'undefined' && (!firebase.apps || !firebase.apps.length)) {
        firebase.initializeApp(firebaseConfig);
    }
}

// Helper to derive bucket and build refs safely (works without default bucket)
function getStorageBucket() {
    try {
        const app = (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase.app() : null;
        const opts = (app && app.options) || firebaseConfig || {};
        return opts.storageBucket || (opts.projectId ? `${opts.projectId}.appspot.com` : null);
    } catch (_) { return null; }
}
function getStorageRefForPath(path) {
    if (typeof firebase === 'undefined' || !firebase.storage) return null;
    const storage = firebase.storage();
    const bucket = getStorageBucket();
    try {
        if (bucket) return storage.refFromURL(`gs://${bucket}/${String(path).replace(/^\/+/, '')}`);
        // fallback to default bucket ref (may fail if no bucket configured)
        return storage.ref().child(path);
    } catch (_) {
        return null;
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
        foto_url: val.foto_url || val.photoURL || '', // <-- incluye foto_url
        foto_path: val.foto_path || val.photoPath || '' // <-- soporte path en Storage
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
        foto_url: val.foto_url || (user && user.photoURL) || '', // <-- incluye foto_url
        foto_path: val.foto_path || val.photoPath || '' // <-- soporte path en Storage
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

    // Smart profile photo resolution (supports URL or Storage path)
    const fallback = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.photoURL) || '/public/assets/img/default-avatar.png';
    const candidate = data.foto_url || data.foto_path || '';
    setProfilePicSmart(candidate, fallback);

    // NEW: prefer username (fallback to nombre) for header and local cache
    const displayName = (data.username && String(data.username).trim()) || (data.nombre && String(data.nombre).trim()) || '';
    if (displayName) {
        updateLocalUserName(displayName);
        setAuthHeaderName(displayName);
    }
}

// ------ Image handling enhancements (validation, resize/compress, URL resolution) ------
const MAX_IMAGE_SIZE_MB = 5;          // Reject files larger than this (before compression attempt)
const TARGET_MAX_DIMENSION = 1280;    // Max width/height after resize
const JPEG_QUALITY = 0.85;            // Compression quality for JPEG output
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Force using ImgBB for all photo uploads
const ALWAYS_USE_IMGBB = true;

// Helper: consistent status updates
function showStatus(text, color = '') {
    const msg = document.getElementById('profile-status');
    if (msg) { msg.textContent = text || ''; msg.style.color = color || ''; }
}

// Helper: detect likely CORS errors
function isLikelyCorsError(err) {
    const msg = (err && (err.message || err.toString())) || '';
    return msg.includes('CORS') ||
           msg.includes('Same Origin Policy') ||
           msg.includes('preflight') ||
           msg.includes('TypeError: NetworkError') ||
           msg.includes('Failed to fetch');
}

// Add: should skip Firebase Storage?
function shouldSkipFirebaseStorage() {
    if (isFileProtocol()) return true;
    if (window.__SKIP_FIREBASE_STORAGE === true) return true;
    try {
        const v = localStorage.getItem('as_skip_storage');
        if (v && v !== 'false' && v !== '0') return true;
    } catch {}
    try {
        const v2 = sessionStorage.getItem('as_storage_cors_bad');
        if (v2 === '1') return true;
    } catch {}
    return false;
}

// Helper: check if running from file:// (will often break CORS)
function isFileProtocol() {
    try { return location && location.protocol === 'file:'; } catch { return false; }
}

// Helper: safe JSON parsing
async function safeJson(res) {
    try { return await res.json(); } catch { return null; }
}

// Helper: dataURL -> Blob (fallback when canvas.toBlob returns null)
function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const meta = parts[0];
    const base64 = parts[1];
    const mime = (meta.match(/data:(.*?);base64/) || [])[1] || 'image/jpeg';
    const binStr = atob(base64);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

// Validates file type and rough size before processing
function validateImageFile(file) {
    if (!file) return { ok: false, reason: 'No file selected.' };
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { ok: false, reason: 'Unsupported image type. Use JPG, PNG or WebP.' };
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_IMAGE_SIZE_MB * 2) { // if wildly large, fail early
        return { ok: false, reason: `Image too large. Max ${MAX_IMAGE_SIZE_MB}MB.` };
    }
    return { ok: true };
}

// Reads dimensions quickly
function readImageAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

function loadImageFromDataURL(dataURL) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataURL;
    });
}

// Resize/compress using canvas when needed
async function preprocessImage(file) {
    const valid = validateImageFile(file);
    if (!valid.ok) throw new Error(valid.reason);

    const dataURL = await readImageAsDataURL(file);
    const img = await loadImageFromDataURL(dataURL);

    const needsResize = Math.max(img.width, img.height) > TARGET_MAX_DIMENSION;
    const needsReencode = file.type !== 'image/jpeg' && file.type !== 'image/jpg';

    // If no resize and size is acceptable, use original
    const sizeMB = file.size / (1024 * 1024);
    if (!needsResize && !needsReencode && sizeMB <= MAX_IMAGE_SIZE_MB) {
        return file; // keep as-is
    }

    // Compute target dims
    let targetW = img.width;
    let targetH = img.height;
    if (needsResize) {
        if (img.width >= img.height) {
            targetW = TARGET_MAX_DIMENSION;
            targetH = Math.round((img.height / img.width) * TARGET_MAX_DIMENSION);
        } else {
            targetH = TARGET_MAX_DIMENSION;
            targetW = Math.round((img.width / img.height) * TARGET_MAX_DIMENSION);
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Export as JPEG to ensure reasonable size (with fallback)
    let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
    if (!blob) {
        // Fallback for older browsers or rare toBlob null cases
        const fallbackDataURL = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        blob = dataURLToBlob(fallbackDataURL);
    }
    const newName = (file.name || 'photo').replace(/\.(png|webp|jpeg|jpg)$/i, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
}

// Backend-assisted resolver for Storage paths (requires backend endpoint)
async function resolvePhotoURLViaBackend(path) {
    if (!backendUrl || !path) return null;
    try {
        const url = `${backendUrl}/storage/url?path=${encodeURIComponent(path)}`;
        const res = await timeoutFetch(url, { credentials: 'include' }, BACKEND_TIMEOUT);
        if (!res.ok) return null;
        const data = await safeJson(res);
        return (data && (data.url || data.downloadURL || data.foto_url)) || null;
    } catch (_) {
        return null;
    }
}

// Resolve photo URLs possibly stored as Firebase Storage paths
async function resolvePhotoURLMaybe(pathOrUrl) {
    if (!pathOrUrl) return null;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

    if (typeof firebase !== 'undefined' && firebase.storage) {
        try {
            if (/^gs:\/\//i.test(pathOrUrl)) {
                const ref = firebase.storage().refFromURL(pathOrUrl);
                return await ref.getDownloadURL();
            } else {
                const ref = getStorageRefForPath(pathOrUrl);
                if (!ref) return null;
                return await ref.getDownloadURL();
            }
        } catch (e) {
            // Try backend resolver on CORS failure
            if (isLikelyCorsError(e)) {
                try { sessionStorage.setItem('as_storage_cors_bad', '1'); } catch {}
                const viaBackend = await resolvePhotoURLViaBackend(pathOrUrl).catch(() => null);
                if (viaBackend) return viaBackend;
                console.warn('Storage URL resolution blocked by CORS. Configure bucket CORS or expose /storage/url in backend.');
            }
        }
    }
    return null;
}

function setProfilePicSmart(candidateUrl, fallbackUrl) {
    const pic = document.getElementById('profilePic');
    if (!pic) return;
    const fallback = fallbackUrl || ((typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.photoURL) || '/public/assets/img/default-avatar.png');

    if (!candidateUrl) {
        pic.src = fallback;
        return;
    }
    if (/^https?:\/\//i.test(candidateUrl)) {
        pic.src = candidateUrl;
        return;
    }
    // Resolve async if it's a storage path
    resolvePhotoURLMaybe(candidateUrl)
        .then((resolved) => { pic.src = resolved || fallback; })
        .catch(() => { pic.src = fallback; });
}

// ----------------- ImgBB upload helper -----------------
async function uploadToImgBB(fileOrBlob) {
    if (!imgbbKey) throw new Error('No ImgBB key configured');
    const asFile = fileOrBlob instanceof File ? fileOrBlob : new File([fileOrBlob], 'upload.jpg', { type: 'image/jpeg' });

    // convierte a base64
    const base64 = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result).split(',')[1]);
        fr.onerror = reject;
        fr.readAsDataURL(asFile);
    });
    const form = new FormData();
    form.append('image', base64);
    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`;
    const res = await fetch(url, { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok || !data || !data.data) throw new Error('ImgBB upload failed');
    return data.data.display_url || data.data.url || null;
}

// Small helper to sync avatar to header and storage
function updateLocalUserPhoto(url) {
    try {
        const raw = localStorage.getItem('as_user') || localStorage.getItem('user') || '{}';
        const obj = JSON.parse(raw);
        const profile = { ...(obj.profile || {}), avatarUrl: url };
        const merged = { ...obj, photoURL: url, avatarUrl: url, avatar: url, profile };
        localStorage.setItem('as_user', JSON.stringify(merged));
        window.dispatchEvent(new Event('as:user-updated'));
    } catch (_) { /* ignore */ }
}

// NEW: sync username for header (localStorage + Firebase Auth displayName)
function updateLocalUserName(name) {
    try {
        const raw = localStorage.getItem('as_user') || localStorage.getItem('user') || '{}';
        const obj = JSON.parse(raw);
        const profile = { ...(obj.profile || {}), displayName: name, username: name };
        const merged = { ...obj, displayName: name, username: name, name, headerLabel: name, profile };
        localStorage.setItem('as_user', JSON.stringify(merged));
        window.dispatchEvent(new Event('as:user-updated'));
    } catch (_) { /* ignore */ }
    try {
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            const u = firebase.auth().currentUser;
            if (!u.displayName || u.displayName !== name) {
                u.updateProfile({ displayName: name }).catch(()=>{});
            }
        }
    } catch (_) { /* ignore */ }
}

// NEW: best-effort update for common header placeholders
function setAuthHeaderName(name) {
    const ids = ['auth-header-name', 'header-username', 'auth-username', 'nav-username'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = name || ''; });
}

// ----------------- Subida de foto (modificada) -----------------
function setupPhotoUpload() {
    const form = document.getElementById('photoForm');
    if (!form) return;
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const input = document.getElementById('photoInput');
        if (!input || !input.files || !input.files[0]) {
            showStatus('Select a file', 'red');
            return;
        }

        // Preprocess (validate + compress/resize)
        let file = input.files[0];
        try {
            showStatus('Processing image...');
            file = await preprocessImage(file);
        } catch (e) {
            showStatus(e.message || 'Invalid image.', 'red');
            console.error('preprocessImage failed:', e);
            return;
        }

        // Ensure user is logged-in
        if (!(typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser)) {
            showStatus('You must be logged in to upload a photo.', 'red');
            return;
        }
        const uid = firebase.auth().currentUser.uid;

        // Enforce ImgBB flow only
        if (ALWAYS_USE_IMGBB) {
            if (!imgbbKey) {
                showStatus('ImgBB API key not configured. Set it in backend /api/config.', 'red');
                return;
            }
            try {
                showStatus('Uploading photo (ImgBB)...');
                const url = await uploadToImgBB(file);
                if (!url) throw new Error('ImgBB did not return a URL');

                // Update Firebase Auth and RTDB with the link
                try { await firebase.auth().currentUser.updateProfile({ photoURL: url }); } catch {}
                try {
                    await firebase.database().ref('users/' + uid).update({
                        foto_url: url,
                        // opcional: metadatos
                        imgbb: { url, updatedAt: Date.now() }
                    });
                    // también eliminar paths antiguos que ya no usaremos
                    await firebase.database().ref('users/' + uid + '/foto_path').remove().catch(() => {});
                } catch {}

                // Update UI/local cache
                setProfilePicSmart(url);
                updateLocalUserPhoto(url);
                showStatus('Profile picture uploaded to ImgBB.', 'green');
                return;
            } catch (e) {
                console.error('ImgBB upload failed:', e);
                showStatus(e && e.message ? e.message : 'ImgBB upload failed.', 'red');
                return;
            }
        }

        // Nota: Como usamos ALWAYS_USE_IMGBB, no alcanzaremos backend ni Firebase Storage.
    });
}

const BACKEND_TIMEOUT = 8000; // was 3000

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
// Diferencia entre fallo de red/timeout y rechazo por autorización
// (This block was duplicated and is now removed)
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
    // Suscripción en tiempo real a cambios de Perfil mientras la sesión esté activa
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
                                foto_url: val.foto_url || user.photoURL || '',
                                foto_path: val.foto_path || val.photoPath || ''
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


