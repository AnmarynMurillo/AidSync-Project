// donate.js: Logic for donation gallery and modal

const CAUSES = [
    {
      id: 1,
      nombre: 'Casa Esperanza Foundation',
      categoria: 'welfare',
      color: '#eab308',
      colorHover: '#ca8a04',
      img: '../assets/img/donation/socialwelfare.png',
      desc: 'Improving the quality of life for vulnerable children and families in Panama.',
      descLarga: 'A non-profit organization established as an NGO since 1992, aiming to provide development opportunities to children and adolescents living in poverty, especially those who generate income and their families.',
      location: 'Panama',
      contact: 'info@casaesperanza.org',
      web: 'https://casaesperanza.org'
    },
    {
      id: 2,
      nombre: 'Health for All',
      categoria: 'health',
      color: '#dc2626',
      colorHover: '#b91c1c',
      img: '../assets/img/donation/brigada-medica.jpg',
      desc: 'Health campaigns and prevention in rural communities.',
      descLarga: 'Health for All brings medical brigades, prevention workshops, and basic care to remote rural communities.',
      location: 'Chiriqui',
      contact: 'contact@saludparatodos.org',
      web: 'https://saludparatodos.org'
    },
    {
      id: 3,
      nombre: 'Educating Futures',
      categoria: 'education',
      color: '#2563eb',
      colorHover: '#1d4ed8',
      img: '../assets/img/donation/education.webp',
      desc: 'Scholarships and tutoring for underprivileged youth.',
      descLarga: 'Educating Futures provides scholarships, mentoring, and academic support to talented low-income youth so they can continue their studies.',
      location: 'West Panama',
      contact: 'info@educandofuturos.org',
      web: 'https://educandofuturos.org'
    },
    {
      id: 4,
      nombre: 'Urban Green',
      categoria: 'environment',
      color: '#16a34a',
      colorHover: '#15803d',
      img: '../assets/img/donation/environment.png',
      desc: 'Reforestation and environmental education in cities.',
      descLarga: 'Urban Green promotes tree planting, workshops, and environmental awareness campaigns in urban areas.',
      location: 'Panama City',
      contact: 'info@verdeurbano.org',
      web: 'https://verdeurbano.org'
    }
  ];
  
  const gallery = document.getElementById('donate-gallery');
  const modal = document.getElementById('donate-modal');
  const modalBody = modal.querySelector('.modal-body');
  const closeBtn = modal.querySelector('.modal-close');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  function renderCards(category = 'all') {
    gallery.innerHTML = '';
    CAUSES.filter(c => category === 'all' || c.categoria === category)
      .forEach(c => {
        const card = document.createElement('div');
        card.className = 'donate-card';
        card.style.setProperty('--cat-color', c.color);
        card.style.setProperty('--cat-color-hover', c.colorHover);
        card.innerHTML = `
          <div class="card-image-container">
            <img src="${c.img}" alt="${c.nombre}" class="card-image">
            <div class="card-category" style="background-color: ${c.color}">${c.categoria.charAt(0).toUpperCase() + c.categoria.slice(1)}</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${c.nombre}</h3>
            <p class="card-description">${c.desc}</p>
            <div class="card-footer">
              <div class="card-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${c.location}</span>
              </div>
              <button class="donate-btn">
                <i class="fas fa-heart"></i> Donate Now
              </button>
            </div>
          </div>
        `;
        
        // Make the entire card clickable
        card.addEventListener('click', (e) => {
          // Prevent click from propagating to parent elements
          e.stopPropagation();
          // Check if click was not on a button or other interactive element
          if (!e.target.closest('button, a, input, select, textarea')) {
            openModal(c);
          }
        });
        
        // Keep button event for compatibility
        const donateBtn = card.querySelector('.donate-btn');
        if (donateBtn) {
          donateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(c);
          });
        }
        
        gallery.appendChild(card);
      });
  }
  
  function openModal(cause) {
    // Set the image as a CSS variable for the modal
    document.documentElement.style.setProperty('--donation-image', `url('${cause.img}')`);
    
    // Create modal HTML
    const modalHTML = `
      <div class="donation-modal show" id="donation-modal">
        <div class="modal-container">
          <button class="modal-close" aria-label="Cerrar">&times;</button>
          
          <!-- Image Section -->
          <div class="image-section">
            <div>
              <div class="logo">${cause.nombre}</div>
              <div class="tagline">${cause.desc}</div>
            </div>
          </div>
          
          <!-- Content Section -->
          <div class="content-section">
            <h1 class="modal-title">${cause.nombre}</h1>
            <p class="modal-description">${cause.descLarga}</p>
            
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>${cause.location || 'No location specified'}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <a href="mailto:${cause.contact}" class="detail-link">${cause.contact}</a>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🌐</span>
                <a href="${cause.web}" target="_blank" class="detail-link">${cause.web.replace('https://','')}</a>
              </div>
            </div>
            
            <form id="donation-form" class="donation-form">
              <div class="amount-section">
                <h2 class="amount-title">Select Donation Amount</h2>
                <div class="amount-buttons">
                  <button type="button" class="amount-btn" data-amount="10">10</button>
                  <button type="button" class="amount-btn" data-amount="25">25</button>
                  <button type="button" class="amount-btn" data-amount="50">50</button>
                  <button type="button" class="amount-btn" data-amount="100">100</button>
                </div>
                
                <div class="other-amount-container">
                  <label for="custom-amount" class="other-amount-label">Or enter a custom amount:</label>
                  <div class="other-amount">
                    <div class="dollar-sign">$</div>
                    <input type="number" id="custom-amount" name="amount" class="amount-input" placeholder="Enter amount" min="1" step="0.01" required>
                  </div>
                </div>
              </div>
              
              <div class="donate-btn-container">
                <button type="submit" class="donate-btn">
                  <i class="fas fa-heart"></i> Donate Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Insert modal into the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const modal = document.getElementById('donation-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const amountBtns = modal.querySelectorAll('.amount-btn');
    const amountInput = modal.querySelector('.amount-input');
    const donateBtn = modal.querySelector('.donate-btn');
    
    // Close modal when clicking the close button or outside the modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Handle amount button selection
    amountBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        amountBtns.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        amountInput.value = this.dataset.amount;
      });
    });
    
    // Clear button selection when typing a custom amount
    amountInput.addEventListener('focus', function() {
      amountBtns.forEach(btn => btn.classList.remove('selected'));
    });
    
    // Handle form submission
    const donationForm = modal.querySelector('#donation-form');
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get donation amount
      const selectedBtn = modal.querySelector('.amount-btn.selected');
      const customAmount = modal.querySelector('#custom-amount').value;
      let amount = '';
      
      if (selectedBtn) {
        amount = selectedBtn.dataset.amount;
      } else if (customAmount) {
        amount = customAmount;
      }
      
      // Validate amount
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert('Please enter a valid donation amount.');
        return;
      }
      
      // Get cause name
      const causeName = modal.querySelector('.modal-title').textContent;
      
      // Show success message
      const contentSection = modal.querySelector('.content-section');
      contentSection.innerHTML = `
        <div class="donation-success">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2>Thank you for your donation!</h2>
          <p>Your generous donation of $${amount} to <strong>${causeName}</strong> has been received.</p>
          <button id="close-success" class="donate-btn">
            <i class="fas fa-check"></i> Done
          </button>
        </div>
      `;
      
      // Add event listener to close button
      document.getElementById('close-success').addEventListener('click', closeModal);
    });
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Focus the modal for accessibility
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
  }
  
  function closeModal() {
    const modal = document.getElementById('donation-modal');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  }
  
  function setupPaymentMethods() {
    const methodBtns = modalBody.querySelectorAll('.payment-method-btn');
    const paymentFields = modalBody.querySelector('#payment-fields');
    let selectedMethod = 'tarjeta';
  
    function renderFields() {
      if (selectedMethod === 'tarjeta') {
        paymentFields.innerHTML = `
          <div class="field-group">
            <input type="text" placeholder="Número de tarjeta" maxlength="19" class="input-card-number" required>
            <input type="text" placeholder="MM/AA" maxlength="5" class="input-card-expiry" required style="width:80px;">
            <input type="text" placeholder="CVV" maxlength="4" class="input-card-cvv" required style="width:60px;">
          </div>
        `;
      } else {
        paymentFields.innerHTML = `
          <div class="field-group">
            <div><strong>Banco:</strong> Banco Nacional de Panamá</div>
            <div><strong>Cuenta:</strong> 1234567890</div>
            <div><strong>Tipo:</strong> Ahorros</div>
            <div><strong>Nombre:</strong> AidSync Foundation</div>
          </div>
        `;
      }
    }
  
    methodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        methodBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMethod = btn.dataset.method;
        renderFields();
      });
    });
    renderFields();
  }
  
  function setupModalEvents() {
    // Amount selection
    const amountBtns = modalBody.querySelectorAll('.donate-amount-btn');
    const customInput = modalBody.querySelector('.donate-custom');
    let selectedAmount = null;
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAmount = btn.dataset.amount;
        customInput.value = '';
      });
    });
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      selectedAmount = customInput.value;
    });
    // Confirm donation
    const confirmBtn = modalBody.querySelector('.donate-confirm');
    const successMsg = modalBody.querySelector('.donate-success');
    confirmBtn.addEventListener('click', () => {
      const selectedMethodBtn = modalBody.querySelector('.payment-method-btn.selected');
      const method = selectedMethodBtn ? selectedMethodBtn.dataset.method : 'tarjeta';
      const amount = selectedAmount || customInput.value;
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        successMsg.style.display = 'block';
        successMsg.textContent = 'Please enter a valid amount.';
        successMsg.style.color = '#dc2626';
        return;
      }
      confirmBtn.disabled = true;
      successMsg.style.display = 'block';
      successMsg.style.color = '#16a34a';
      successMsg.textContent = 'Thank you for your donation of $' + amount + '!';
      setTimeout(() => {
        closeModal();
      }, 2000);
    });
  }
  
  // Initialize filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.category);
    });
  });
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    if (filterBtns.length > 0) {
      filterBtns[0].classList.add('active');
    }
  });