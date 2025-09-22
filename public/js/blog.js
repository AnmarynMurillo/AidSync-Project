// blog.js - Modern, moderated, and functional AidSync Blog

// Sample blog post data
const BLOG_POSTS = [
  // Health Organizations
  {
    id: 7,
    title: 'Dona Vida: Saving Lives Through Blood Donation',
    image: '/public/assets/img/donation/BRIGADA-MEDICA.jpg',
    excerpt: 'Dona Vida is a non-profit foundation that promotes voluntary blood donation in Panama.',
    content: 'Dona Vida is a non-profit foundation that seeks to promote voluntary blood donation. The blood donated through Dona Vida strengthens the blood banks of its partner hospitals: Hospital Santo Tomás, Hospital del Niño, Instituto Oncológico Nacional, and Hospital Luis "Chicho" Fábrega. Your donation can save up to three lives!',
    author: 'AidSync Team',
    date: '2025-06-15',
    featured: true,
    video: '',
    comments: []
  },
  {
    id: 8,
    title: 'United Way Panamá: Comprehensive Support for Vulnerable Communities',
    image: '/public/assets/img/support_organization/saludparatodos.jpg',
    excerpt: 'United Way Panamá provides essential support and resources to those in need.',
    content: 'United Way Panamá is dedicated to improving lives through various initiatives. Donations help supply basic needs, medicines, and support for beneficiaries, including emotional and psychological care, assistance to people in situations of domestic violence, economic support for families at risk, and educational and technological innovation. They also ensure job continuity for staff working directly with vulnerable populations.',
    author: 'AidSync Team',
    date: '2025-06-10',
    featured: true,
    video: '',
    comments: []
  },
  
  // Education Organizations
  {
    id: 9,
    title: 'A Company A Classroom: Transforming Education in Panama',
    image: '/public/assets/img/support_organization/educa_futuro.jpg',
    excerpt: 'Support public education through classroom adoption and donations.',
    content: '• Adopt a classroom: Sponsor a classroom with an initial donation and periodic contributions, improving infrastructure and receiving progress updates.\n\n• Solidarity sum, in-kind donations, skills donation, or networking donation: versatile options that allow support with material goods, professional services, and connections. This initiative promotes public education through online monetary donations or bank transfers.',
    author: 'AidSync Team',
    date: '2025-06-05',
    featured: false,
    video: '',
    comments: []
  },
  {
    id: 10,
    title: 'Juan Pablo II Educational Foundation: Empowering Youth Through Education',
    image: '/public/assets/img/Carrusel_1/Educacion.jpg',
    excerpt: 'Providing scholarships to underprivileged Panamanian youth for over three decades.',
    content: 'FEJPS is a non-profit foundation that grants school and university scholarships to underprivileged Panamanian youth with high academic and personal potential. For more than three decades, they have awarded over 3,200 scholarships, with an impact of more than $15 million in university education. At the secondary level, they have provided more than 2,500 scholarships with a 92% graduation rate.\n\nYou can support their mission through monthly or one-time tax-deductible donations via ACH transfers or recurring credit card payments.',
    author: 'AidSync Team',
    date: '2025-05-30',
    featured: false,
    video: '',
    comments: []
  },
  
  // Environment Organizations
  {
    id: 11,
    title: 'Ecobio Panamá: Protecting Our Natural Heritage',
    image: '/public/assets/img/Carrusel_1/environment.jpg',
    excerpt: 'Dedicated to conserving Panama\'s unique biodiversity through sustainable initiatives.',
    content: 'At Ecobio Panamá, we work tirelessly to protect our country\'s unique biodiversity. Our projects focus on ecosystem conservation, environmental education, and sustainable development. You can support our projects financially - every contribution, no matter the size, makes a big difference in preserving Panama\'s natural heritage for future generations.',
    author: 'AidSync Team',
    date: '2025-05-25',
    featured: true,
    video: '',
    comments: []
  },
  {
    id: 12,
    title: 'Fundación Cero Basura Panamá: A Cleaner Future',
    image: '/public/assets/img/volunter/Reforestacion.jpeg',
    excerpt: 'Combatting waste and visual pollution through community action and education.',
    content: 'Fundación Cero Basura Panamá was created on October 21, 2021, with the purpose of improving our country\'s environment while eliminating visual pollution caused by the high level of waste we see daily in our communities. You can contribute financially or in-kind to support their recycling and environmental education programs. Together, we can create cleaner, more sustainable communities across Panama.',
    author: 'AidSync Team',
    date: '2025-05-20',
    featured: false,
    video: '',
    comments: []
  },
  
  // Social Welfare Organizations
  {
    id: 13,
    title: 'Pro Integration Foundation: Supporting People with Disabilities',
    image: '/public/assets/img/support_organization/red_solidaria.jpg',
    excerpt: 'Providing essential mobility and hearing devices to improve quality of life.',
    content: 'Fundación Pro Integración (FUNPROI) provides vital support including:\n\n• Specialized devices to improve mobility for people with physical disabilities, such as wheelchairs, postural chairs, canes, and crutches.\n• Hearing aids and cochlear implants for people with hearing disabilities.\n• Transportation support to facilitate access to health services.\n\nYou can support their mission through bank transfers or Yappy donations.',
    author: 'AidSync Team',
    date: '2025-05-15',
    featured: false,
    video: '',
    comments: []
  },
  {
    id: 14,
    title: 'HTN Foundation: Comprehensive Support for Social Causes',
    image: '/public/assets/img/Carrusel_1/Social_welfare.png',
    excerpt: 'Supporting various social organizations through multiple donation channels.',
    content: 'Fundación HTN offers multiple ways to support social causes:\n\n• Financial donations\n• Products and services needed by social organizations\n• You may even consider donating an inheritance through their platform\n\nThrough their intelligent system, you can provide financial donations, products, services, and even inheritances to support those in need across Panama.',
    author: 'AidSync Team',
    date: '2025-05-05',
    featured: false,
    video: '',
    comments: []
  },
  {
    id: 1,
    title: 'Volunteering in Darién',
    image: '/public/assets/img/donation/BRIGADA-MEDICA.jpg',
    excerpt: 'A life-changing experience helping rural communities in Darién... Read the full story!',
    content: 'Full story of the experience in Darién. Lots of learning, teamwork, and gratitude. I participated in building a school and in health workshops for children and adults. I recommend everyone to live such an experience.',
    author: 'John Perez',
    date: '2025-05-10',
    featured: true,
    video: '',
    comments: [
      { author: 'Maria', text: 'Inspiring! How can I participate?', date: '2025-05-11', approved: true }
    ]
  },
  {
    id: 2,
    title: 'Health Day in Chiriquí',
    image: '/public/assets/img/volunter/Pro-comedores.jpg',
    excerpt: 'Doctors and volunteers provided care to over 200 people in rural areas of Chiriquí.',
    content: 'Chronicle of the health day: doctors, nurses, and AidSync volunteers provided consultations, medicines, and prevention talks to families in remote communities. Thanks to everyone who supported!',
    author: 'Anna Torres',
    date: '2025-04-28',
    featured: true,
    video: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    comments: []
  },
  {
    id: 3,
    title: 'Urban Reforestation',
    image: '/public/assets/img/volunter/Reforestacion.jpeg',
    excerpt: 'Over 500 trees planted in the city thanks to volunteers and partner companies.',
    content: 'Campaign details: native species were planted in parks and main avenues. Students, companies, and families participated. Together for cleaner air!',
    author: 'Charles Ruiz',
    date: '2025-04-15',
    featured: false,
    video: '',
    comments: []
  },
  {
    id: 4,
    title: 'Stories of Hope',
    image: '/public/assets/img/volunter/banco.jpg',
    excerpt: 'Testimonies of people benefited by AidSync and its social programs.',
    content: 'Real stories of social impact: interviews with families who received support in health, education, and housing. AidSync continues to transform lives with your help.',
    author: 'Sophie Martinez',
    date: '2025-03-30',
    featured: false,
    video: '',
    comments: []
  },
  {
    id: 5,
    title: 'Youth Entrepreneurship Workshop',
    image: '/public/assets/img/donation/BRIGADA-MEDICA.jpg',
    excerpt: 'Young people from different provinces participated in a workshop to create their own businesses.',
    content: 'The workshop included mentoring, talks by entrepreneurs, and business simulations. Several projects received seed capital. The future belongs to the youth!',
    author: 'Laura Gomez',
    date: '2025-03-15',
    featured: false,
    video: '',
    comments: []
  },
  {
    id: 6,
    title: 'Alliance with Smiles Foundation',
    image: '/public/assets/img/volunter/Pro-comedores.jpg',
    excerpt: 'New partnership to provide free dental care to vulnerable communities.',
    content: 'AidSync and Smiles Foundation join forces to carry out oral health days in rural schools. Hygiene kits were delivered and more than 300 children were treated.',
    author: 'AidSync Team',
    date: '2025-02-28',
    featured: false,
    video: '',
    comments: []
  }
];

const POSTS_PER_PAGE = 4;
let currentPage = 1;
let filteredPosts = BLOG_POSTS;

// Comment and post moderation simulation
let PENDING_COMMENTS = [];
let PENDING_POSTS = [];

// Simulated authenticated user
let USER_LOGGED_IN = false; // Change to true to simulate logged in user
let IS_AIDSYNC_TEAM = false; // Change to true to simulate AidSync team member

// Render featured posts (approved only)
function renderFeatured() {
  const featured = BLOG_POSTS.filter(p => p.featured && (p.approved !== false || p.approved === undefined));
  const container = document.getElementById('featured-posts');
  container.innerHTML = featured.map(post => `
    <div class="featured-card" data-id="${post.id}">
      <img src="${post.image}" alt="${post.title}">
      <div class="card-content">
        <div class="card-title">${post.title}</div>
        <div class="card-excerpt">${post.excerpt}</div>
        <button class="read-more">Read more</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.featured-card .read-more').forEach(btn => {
    btn.onclick = e => openModal(featured.find(p => p.id == btn.closest('.featured-card').dataset.id));
  });
}

// Render post list (approved only)
function renderList(page = 1) {
  const list = document.getElementById('blog-list');
  const start = (page-1)*POSTS_PER_PAGE;
  const end = start+POSTS_PER_PAGE;
  // Show all approved posts or those without an approved field (original posts)
  const posts = filteredPosts.filter(p => (p.approved !== false && p.approved !== undefined) || p.approved === undefined).slice(start, end);
  list.innerHTML = posts.map(post => `
    <div class="blog-card" data-id="${post.id}">
      <img src="${post.image}" alt="${post.title}">
      <div class="card-content">
        <div class="card-title">${post.title}</div>
        <div class="card-excerpt">${post.excerpt}</div>
        <button class="read-more">Read more</button>
      </div>
    </div>
  `).join('');
  renderPagination();
}

// Render pagination with only 3 visible buttons
function renderPagination() {
  const pag = document.getElementById('blog-pagination');
  const total = Math.ceil(filteredPosts.length/POSTS_PER_PAGE);
  pag.innerHTML = '';
  // If no pages, do not show anything
  if (total < 2) return;
  for(let i=1;i<=total;i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i===currentPage) btn.classList.add('active');
    // Show only the current and adjacent buttons
    if (Math.abs(i-currentPage) <= 1) {
      btn.setAttribute('data-visible','true');
    }
    btn.onclick = () => { currentPage = i; renderList(i); };
    pag.appendChild(btn);
  }
}

// Smooth animation when loading posts
function animateCards() {
  document.querySelectorAll('.blog-card, .featured-card').forEach(card => {
    card.classList.remove('visible');
    setTimeout(() => {
      card.classList.add('visible');
    }, 100);
  });
}

// Call animation after rendering
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

// Entry modal (approved comments only)
const modal = document.getElementById('blog-modal');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.modal-close');

function openModal(post) {
  const commentsHtml = post.comments && post.comments.length > 0 
    ? post.comments
        .filter(c => c.approved !== false)
        .map(c => `
          <div class="comment">
            <div class="comment-meta">${c.author} - ${c.date}</div>
            <p>${c.text}</p>
          </div>
        `).join('')
    : '<p>No comments yet. Be the first to comment!</p>';
  modalBody.innerHTML = `
    <div class="modal-image-container">
      ${post.video 
        ? `<div class="video-container">
             <iframe width="100%" height="400" src="${post.video}" frameborder="0" allowfullscreen></iframe>
           </div>`
        : post.image 
          ? `<img src="${post.image}" alt="${post.title}">`
          : '<div style="background: #f0f0f0; width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; border-radius: 0.7rem;">No image available</div>'
      }
    </div>
    <div class="modal-content-container">
      <h2>${post.title}</h2>
      <div class="modal-meta">
        By ${post.author} • ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div class="modal-content-text">
        ${post.content.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>
      <div class="comments-section">
        <h3>Comments</h3>
        <div class="comments-list">
          ${commentsHtml}
        </div>
        ${USER_LOGGED_IN 
          ? `
            <form class="add-comment-form">
              <textarea placeholder="Write your comment..." required></textarea>
              <button type="submit">Post Comment</button>
            </form>
          `
          : `
            <div class="login-prompt">
              <p>Log in to leave a comment</p>
              <a href="/public/pages/login.html" class="login-button">Log In</a>
            </div>
          `
        }
      </div>  
    </div>
  `;

  if (USER_LOGGED_IN) {
    setupCommentForm(post);
  }

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
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

// Comments: simulate moderation (not shown until "approved")
function setupCommentForm(post) {
  const form = modalBody.querySelector('.add-comment-form');
  const msg = modalBody.querySelector('.comment-msg');
  form.onsubmit = (e) => {
    e.preventDefault();
    const text = form.querySelector('textarea').value.trim();
    if (!text) return;
    
    // Simulate server submission
    const newComment = {
      author: 'Current User', // In a real case, you would get the logged-in user
      text: text,
      date: new Date().toISOString().split('T')[0],
      approved: IS_AIDSYNC_TEAM // If it's from the team, it's automatically approved
    };
    
    // If it's from the team or doesn't require moderation, add directly
    if (newComment.approved) {
      if (!post.comments) post.comments = [];
      post.comments.push(newComment);
      openModal(post); // Reload the modal
    } else {
      // If moderation is required
      PENDING_COMMENTS.push({
        ...newComment,
        postId: post.id
      });
      msg.textContent = 'Thank you for your comment! It will be visible after moderation.';
      msg.className = 'comment-msg success';
      form.reset();
      setTimeout(() => msg.textContent = '', 3000);
    }
  };
}

// Interface to submit new post (only if logged in)
function renderNewPostForm() {
  const container = document.createElement('div');
  container.className = 'new-post-container';
  container.innerHTML = `
    <div class="new-post-toggle" id="newPostToggle">
      <i class="fas fa-plus"></i> New Post
    </div>
    <div class="new-post-section" id="newPostSection" style="display: none;">
      <h2>Create New Post</h2>
      <form id="new-post-form" class="new-post-form">
        <div class="form-group">
          <input type="text" name="title" placeholder=" " required maxlength="80">
          <label>Title</label>
        </div>
        <div class="form-group">
          <input type="text" name="author" placeholder=" " required maxlength="40" value="${USER_LOGGED_IN ? (window.currentUser?.displayName || '') : ''}">
          <label>Your name or organization</label>
        </div>
        <div class="form-group">
          <input type="url" name="image" placeholder=" ">
          <label>Image URL (optional)</label>
        </div>
        <div class="form-group">
          <textarea name="excerpt" placeholder=" " maxlength="120" required></textarea>
          <label>Short excerpt (max 120 characters)</label>
        </div>
        <div class="form-group">
          <textarea name="content" placeholder=" " required></textarea>
          <label>Full content</label>
        </div>
        <div class="form-footer">
          <label class="checkbox-container">
            <input type="checkbox" name="featured">
            <span class="checkmark"></span>
            <span>Mark as featured</span>
          </label>
          <div class="form-actions">
            <button type="button" class="btn-cancel" id="cancelPostBtn">Cancel</button>
            <button type="submit" class="btn-submit">
              <span class="btn-text">Publish</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        <div class="post-msg"></div>
      </form>
    </div>
  `;
  
  // Insert at the beginning of the main content
  const main = document.querySelector('.blog-main');
  main.insertBefore(container, main.firstChild);
  
  // Only show the toggle if user is logged in
  const toggle = document.getElementById('newPostToggle');
  const formSection = document.getElementById('newPostSection');
  
  if (!USER_LOGGED_IN) {
    toggle.style.display = 'none';
    return;
  }
  
  // Toggle form visibility
  toggle.addEventListener('click', () => {
    formSection.style.display = formSection.style.display === 'none' ? 'block' : 'none';
    toggle.classList.toggle('active');
  });
  
  // Handle cancel button
  document.getElementById('cancelPostBtn')?.addEventListener('click', () => {
    formSection.style.display = 'none';
    toggle.classList.remove('active');
  });
  
  // Form submission
  document.getElementById('new-post-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Add to pending posts
    PENDING_POSTS.push({
      id: Date.now(),
      titulo: data.title,
      imagen: data.image || '/public/assets/images/hero/voluntariado.jpg',
      extracto: data.excerpt,
      contenido: data.content,
      autor: data.author,
      fecha: new Date().toISOString(),
      destacado: !!data.featured,
      video: '',
      comentarios: [],
      aprobado: false
    });
    
    // Show success message
    const msg = this.querySelector('.post-msg');
    msg.textContent = 'Your post has been submitted for review.';
    msg.style.color = '#16a34a';
    this.reset();
    
    // Hide form after submission
    setTimeout(() => {
      formSection.style.display = 'none';
      toggle.classList.remove('active');
      msg.textContent = '';
    }, 3000);
  });
}

// Moderation interface for AidSync team (team members only)
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

// Fix Read More button to work on all cards
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

// Modify renderFeatured and renderList to call addReadMoreListeners
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
// DETECTAR si usuario está logueado
function detectUserStatus() {
  // 1. Firebase Auth
  if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
    USER_LOGGED_IN = true;
    return;
  }
  
  // 2. localStorage
  const stored = localStorage.getItem('as_user') || localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user && (user.uid || user.email)) {
        USER_LOGGED_IN = true;
        return;
      }
    } catch (_) {}
  }
  
  // 3. Firebase token en localStorage
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.indexOf('firebase:authUser:') === 0) {
      try {
        var fu = JSON.parse(localStorage.getItem(k));
        if (fu && fu.uid) {
          USER_LOGGED_IN = true;
          return;
        }
      } catch (_) {}
    }
  }
  
  USER_LOGGED_IN = false;
}
function initBlog() {
  detectUserStatus(); // NUEVO: detectar estado de usuario
  console.log('👤 User logged in:', USER_LOGGED_IN);
  
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
