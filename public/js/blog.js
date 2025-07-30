// blog.js - Blog AidSync moderno, moderado y funcional

// Datos de ejemplo para publicaciones
const BLOG_POSTS = [
  {
    id: 1,
    titulo: 'Volunteering in Darién',
    imagen: '../../public/assets/images/hero/connection.png',
    extracto: 'A life-changing experience helping rural communities in Darién... Read the full story!',
    contenido: 'Full story of the experience in Darién. Lots of learning, teamwork, and gratitude. I participated in building a school and in health workshops for children and adults. I recommend everyone to live such an experience.',
    autor: 'John Perez',
    fecha: '2025-05-10',
    destacado: true,
    video: '',
    comentarios: [
      { autor: 'Maria', texto: 'Inspiring! How can I participate?', fecha: '2025-05-11', aprobado: true }
    ]
  },
  {
    id: 2,
    titulo: 'Health Day in Chiriquí',
    imagen: '../../public/assets/images/hero/comedor.jpg',
    extracto: 'Doctors and volunteers provided care to over 200 people in rural areas of Chiriquí.',
    contenido: 'Chronicle of the health day: doctors, nurses, and AidSync volunteers provided consultations, medicines, and prevention talks to families in remote communities. Thanks to everyone who supported!',
    autor: 'Anna Torres',
    fecha: '2025-04-28',
    destacado: true,
    video: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    comentarios: []
  },
  {
    id: 3,
    titulo: 'Urban Reforestation',
    imagen: '../../public/assets/images/hero/environment.png',
    extracto: 'Over 500 trees planted in the city thanks to volunteers and partner companies.',
    contenido: 'Campaign details: native species were planted in parks and main avenues. Students, companies, and families participated. Together for cleaner air!',
    autor: 'Charles Ruiz',
    fecha: '2025-04-15',
    destacado: false,
    video: '',
    comentarios: []
  },
  {
    id: 4,
    titulo: 'Stories of Hope',
    imagen: '../../public/assets/images/hero/education.webp',
    extracto: 'Testimonies of people benefited by AidSync and its social programs.',
    contenido: 'Real stories of social impact: interviews with families who received support in health, education, and housing. AidSync continues to transform lives with your help.',
    autor: 'Sophie Martinez',
    fecha: '2025-03-30',
    destacado: false,
    video: '',
    comentarios: []
  },
  {
    id: 5,
    titulo: 'Youth Entrepreneurship Workshop',
    imagen: '../../public/assets/images/hero/connection.png',
    extracto: 'Young people from different provinces participated in a workshop to create their own businesses.',
    contenido: 'The workshop included mentoring, talks by entrepreneurs, and business simulations. Several projects received seed capital. The future belongs to the youth!',
    autor: 'Laura Gomez',
    fecha: '2025-03-15',
    destacado: false,
    video: '',
    comentarios: []
  },
  {
    id: 6,
    titulo: 'Alliance with Smiles Foundation',
    imagen: '../../public/assets/images/hero/comedor.jpg',
    extracto: 'New partnership to provide free dental care to vulnerable communities.',
    contenido: 'AidSync and Smiles Foundation join forces to carry out oral health days in rural schools. Hygiene kits were delivered and more than 300 children were treated.',
    autor: 'AidSync Team',
    fecha: '2025-02-28',
    destacado: false,
    video: '',
    comentarios: []
  }
];

const POSTS_PER_PAGE = 4;
let currentPage = 1;
let filteredPosts = BLOG_POSTS;

// Simulación de moderación de comentarios y publicaciones
let PENDING_COMMENTS = [];
let PENDING_POSTS = [];

// Simulación de usuario autenticado
let USER_LOGGED_IN = false; // Cambia a true para simular usuario logueado
let IS_AIDSYNC_TEAM = false; // Cambia a true para simular equipo AidSync

// Render destacados (solo aprobados)
function renderFeatured() {
  const featured = BLOG_POSTS.filter(p => p.destacado && (p.aprobado !== false || p.aprobado === undefined));
  const container = document.getElementById('featured-posts');
  container.innerHTML = featured.map(post => `
    <div class="featured-card" data-id="${post.id}">
      <img src="${post.imagen}" alt="${post.titulo}">
      <div class="card-content">
        <div class="card-title">${post.titulo}</div>
        <div class="card-excerpt">${post.extracto}</div>
        <button class="read-more">Read more</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.featured-card .read-more').forEach(btn => {
    btn.onclick = e => openModal(featured.find(p => p.id == btn.closest('.featured-card').dataset.id));
  });
}

// Render lista (solo aprobados)
function renderList(page = 1) {
  const list = document.getElementById('blog-list');
  const start = (page-1)*POSTS_PER_PAGE;
  const end = start+POSTS_PER_PAGE;
  // Mostrar todos los posts aprobados o los que no tienen campo aprobado (posts originales)
  const posts = filteredPosts.filter(p => (p.aprobado !== false && p.aprobado !== undefined) || p.aprobado === undefined).slice(start, end);
  list.innerHTML = posts.map(post => `
    <div class="blog-card" data-id="${post.id}">
      <img src="${post.imagen}" alt="${post.titulo}">
      <div class="card-content">
        <div class="card-title">${post.titulo}</div>
        <div class="card-excerpt">${post.extracto}</div>
        <button class="read-more">Read more</button>
      </div>
    </div>
  `).join('');
  renderPagination();
}

// Render paginación con solo 3 botones visibles
function renderPagination() {
  const pag = document.getElementById('blog-pagination');
  const total = Math.ceil(filteredPosts.length/POSTS_PER_PAGE);
  pag.innerHTML = '';
  // Si no hay páginas, no mostrar nada
  if (total < 2) return;
  for(let i=1;i<=total;i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i===currentPage) btn.classList.add('active');
    // Mostrar solo el actual y los adyacentes
    if (Math.abs(i-currentPage) <= 1) {
      btn.setAttribute('data-visible','true');
    }
    btn.onclick = () => { currentPage = i; renderList(i); };
    pag.appendChild(btn);
  }
}

// Animación suave al cargar entradas
function animateCards() {
  document.querySelectorAll('.blog-card, .featured-card').forEach(card => {
    card.classList.remove('visible');
    setTimeout(() => {
      card.classList.add('visible');
    }, 100);
  });
}

// Llamar animación después de renderizar
const oldRenderList = renderList;
renderList = function(page = 1) {
  oldRenderList(page);
  animateCards();
  addReadMoreListeners();
};
const oldRenderFeatured = renderFeatured;
renderFeatured = function() {
  oldRenderFeatured();
  animateCards();
  addReadMoreListeners();
};

// Modal de entrada (solo comentarios aprobados)
const modal = document.getElementById('blog-modal');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.modal-close');

function openModal(post) {
  let videoEmbed = post.video ? `<iframe width="100%" height="320" src="${post.video}" frameborder="0" allowfullscreen style="margin-bottom:1.2rem;"></iframe>` : '';
  modalBody.innerHTML = `
    <img src="${post.imagen}" alt="${post.titulo}">
    <h2>${post.titulo}</h2>
    <div class="modal-meta">${post.autor} | ${new Date(post.fecha).toLocaleDateString()}</div>
    <div class="modal-content-text">${post.contenido}</div>
    ${videoEmbed}
    <div class="comments-section">
      <h3>Comments</h3>
      <div class="comments-list">
        ${post.comentarios.filter(c=>c.aprobado).map(c=>`<div class="comment"><div class="comment-meta">${c.autor} | ${new Date(c.fecha).toLocaleDateString()}</div>${c.texto}</div>`).join('')}
      </div>
      ${USER_LOGGED_IN ? `<form class="add-comment-form">
        <textarea required placeholder="Write your comment..."></textarea>
        <button type="submit">Send comment</button>
      </form>` : `<div class="comment-login-msg">Log in to comment.</div>`}
      <div class="comment-msg" style="color:#16a34a;margin-top:0.5rem;"></div>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');
  modal.focus();
  if(USER_LOGGED_IN) setupCommentForm(post);
}

function closeModal() {
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
}
closeBtn.onclick = closeModal;
modal.onclick = e => { if(e.target===modal) closeModal(); };
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// Comentarios: simula moderación (no aparecen hasta ser "aprobados")
function setupCommentForm(post) {
  const form = modalBody.querySelector('.add-comment-form');
  const msg = modalBody.querySelector('.comment-msg');
  form.onsubmit = e => {
    e.preventDefault();
    const texto = form.querySelector('textarea').value;
    PENDING_COMMENTS.push({postId: post.id, autor: 'User', texto, fecha: new Date().toISOString(), aprobado: false});
    msg.textContent = 'Your comment was sent for review.';
    form.reset();
  };
}

// Interfaz para enviar nueva publicación (solo si logueado)
function renderNewPostForm() {
  const container = document.createElement('section');
  container.className = 'new-post-section';
  container.style.display = USER_LOGGED_IN ? 'block' : 'none';
  container.innerHTML = `
    <h2>Submit New Post</h2>
    <form id="new-post-form" class="new-post-form">
      <input type="text" name="titulo" placeholder="Title" required maxlength="80">
      <input type="text" name="autor" placeholder="Your name or organization" required maxlength="40">
      <input type="url" name="imagen" placeholder="Image URL (optional)">
      <textarea name="extracto" placeholder="Short excerpt (max 120 characters)" maxlength="120" required></textarea>
      <textarea name="contenido" placeholder="Full content" required></textarea>
      <label><input type="checkbox" name="destacado"> Mark as featured</label>
      <button type="submit">Send post</button>
      <div class="post-msg" style="color:#16a34a;margin-top:0.5rem;"></div>
    </form>
    ${!USER_LOGGED_IN ? '<div class="comment-login-msg">Log in to submit posts.</div>' : ''}
  `;
  document.querySelector('.blog-main').insertBefore(container, document.querySelector('.featured-section'));
  if(USER_LOGGED_IN) {
    document.getElementById('new-post-form').onsubmit = function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      PENDING_POSTS.push({
        id: Date.now(),
        titulo: data.titulo,
        imagen: data.imagen || '../../public/assets/images/hero/voluntariado.jpg',
        extracto: data.extracto,
        contenido: data.contenido,
        autor: data.autor,
        fecha: new Date().toISOString(),
        destacado: !!data.destacado,
        video: '',
        comentarios: [],
        aprobado: false
      });
      this.querySelector('.post-msg').textContent = 'Your post was sent for review.';
      this.reset();
    };
  }
}

// Interfaz de moderación para el equipo AidSync (solo si es equipo)
function renderModerationPanel() {
  if (!IS_AIDSYNC_TEAM) return;
  const panel = document.createElement('section');
  panel.className = 'moderation-section';
  panel.innerHTML = `
    <h2>Moderation (AidSync Team)</h2>
    <div class="moderation-posts">
      <h3>Pending posts</h3>
      <div id="pending-posts"></div>
    </div>
    <div class="moderation-comments">
      <h3>Pending comments</h3>
      <div id="pending-comments"></div>
    </div>
  `;
  document.querySelector('.blog-main').appendChild(panel);
  updateModerationPanel();
}

function updateModerationPanel() {
  // Posts
  const postsDiv = document.getElementById('pending-posts');
  postsDiv.innerHTML = PENDING_POSTS.length ? PENDING_POSTS.map(post => {
    return `<div class="pending-item">
      <b>${post.titulo}</b> by ${post.autor}<br />
      <button onclick="approvePost(${post.id})">Approve</button>
      <button onclick="rejectPost(${post.id})">Reject</button>
    </div>`;
  }).join('') : '<em>No pending posts.</em>';
  // Comments
  const commDiv = document.getElementById('pending-comments');
  commDiv.innerHTML = PENDING_COMMENTS.length ? PENDING_COMMENTS.map((c,i) => {
    return `<div class="pending-item">
      <b>${c.autor}</b>: ${c.texto}<br />
      <button onclick="approveComment(${i})">Approve</button>
      <button onclick="rejectComment(${i})">Reject</button>
    </div>`;
  }).join('') : '<em>No pending comments.</em>';
}

window.approvePost = function(id) {
  const idx = PENDING_POSTS.findIndex(p=>p.id==id);
  if(idx>-1) {
    const post = PENDING_POSTS.splice(idx,1)[0];
    post.aprobado = true;
    BLOG_POSTS.push(post);
    filteredPosts = BLOG_POSTS;
    renderList();
    renderFeatured();
    updateModerationPanel();
  }
};
window.rejectPost = function(id) {
  const idx = PENDING_POSTS.findIndex(p=>p.id==id);
  if(idx>-1) {
    PENDING_POSTS.splice(idx,1);
    updateModerationPanel();
  }
};
window.approveComment = function(i) {
  const c = PENDING_COMMENTS[i];
  if(c) {
    const post = BLOG_POSTS.find(p=>p.id==c.postId);
    if(post) post.comentarios.push({...c, aprobado:true});
    PENDING_COMMENTS.splice(i,1);
    updateModerationPanel();
    if(document.getElementById('blog-modal').getAttribute('aria-hidden')==='false') openModal(post);
  }
};
window.rejectComment = function(i) {
  PENDING_COMMENTS.splice(i,1);
  updateModerationPanel();
};

// Corregir botón Leer más para que funcione en todas las tarjetas
function addReadMoreListeners() {
  // Featured
  document.querySelectorAll('.featured-card .read-more').forEach(btn => {
    btn.onclick = e => {
      const card = btn.closest('.featured-card');
      const id = card ? card.dataset.id : null;
      const post = BLOG_POSTS.find(p => p.id == id);
      if(post) openModal(post);
    };
  });
  // Blog list
  document.querySelectorAll('.blog-card .read-more').forEach(btn => {
    btn.onclick = e => {
      const card = btn.closest('.blog-card');
      const id = card ? card.dataset.id : null;
      const post = BLOG_POSTS.find(p => p.id == id);
      if(post) openModal(post);
    };
  });
}

// Modifica renderFeatured y renderList para llamar addReadMoreListeners
const oldRenderList2 = renderList;
renderList = function(page = 1) {
  oldRenderList2(page);
  animateCards();
  addReadMoreListeners();
};
const oldRenderFeatured2 = renderFeatured;
renderFeatured = function() {
  oldRenderFeatured2();
  animateCards();
  addReadMoreListeners();
};

// Inicialización
function initBlog() {
  renderNewPostForm();
  renderFeatured();
  renderList();
  renderModerationPanel();
  // Buscador
  const searchInput = document.getElementById('blog-search');
  if(searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      filteredPosts = BLOG_POSTS.filter(p => p.titulo.toLowerCase().includes(q) || p.extracto.toLowerCase().includes(q) || p.contenido.toLowerCase().includes(q));
      currentPage = 1;
      renderList();
    });
  }
}

document.addEventListener('DOMContentLoaded', initBlog);
