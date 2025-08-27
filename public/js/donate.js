// donate.js: Lógica para galería de donaciones y modal

const CAUSES = [
    {
      id: 1,
      nombre: 'Casa Esperanza Foundation',
      categoria: 'wellbeing',
      color: '#eab308',
      colorHover: '#ca8a04',
      img: '../assets/img/donation/socialwelfare.png',
      desc: 'Improving the quality of life for vulnerable children and families in Panama.',
      descLarga: 'A non-profit organization established as an NGO since 1992, aiming to provide development opportunities to children and adolescents living in poverty, especially those who generate income and their families.',
      ubicacion: 'Panama',
      contacto: 'info@casaesperanza.org',
      web: 'https://casaesperanza.org'
    },
    {
      id: 2,
      nombre: 'Health for All',
      categoria: 'health',
      color: '#dc2626',
      colorHover: '#b91c1c',
      img: '../assets/img/donation/BRIGADA-MEDICA.jpg',
      desc: 'Health campaigns and prevention in rural communities.',
      descLarga: 'Health for All brings medical brigades, prevention workshops, and basic care to remote rural communities.',
      ubicacion: 'Chiriquí',
      contacto: 'contacto@saludparatodos.org',
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
      ubicacion: 'West Panama',
      contacto: 'info@educandofuturos.org',
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
      ubicacion: 'Panama City',
      contacto: 'info@verdeurbano.org',
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
          <img src="${c.img}" alt="${c.nombre}">
          <div class="card-content">
            <div class="card-title">${c.nombre}</div>
            <div class="card-desc">${c.desc}</div>
            <button class="donate-btn">Donate now</button>
          </div>
        `;
        card.querySelector('.donate-btn').addEventListener('click', e => {
          e.stopPropagation();
          openModal(c);
        });
        gallery.appendChild(card);
      });
  }
  
  function openModal(cause) {
    modalBody.innerHTML = `
      <img src="${cause.img}" alt="${cause.nombre}" class="modal-img">
      <h2>${cause.nombre}</h2>
      <div class="modal-desc">${cause.descLarga}</div>
      <div class="modal-details">
        <div><strong>Location:</strong> ${cause.ubicacion || '-'}</div>
        <div><strong>Contact:</strong> <a href="mailto:${cause.contacto}">${cause.contacto}</a></div>
        <div><strong>Website:</strong> <a href="${cause.web}" target="_blank">${cause.web.replace('https://','')}</a></div>
      </div>
      <div class="modal-donate-options">
        <button class="donate-amount-btn" data-amount="5">$5</button>
        <button class="donate-amount-btn" data-amount="10">$10</button>
        <button class="donate-amount-btn" data-amount="25">$25</button>
        <input type="number" min="1" placeholder="Otro" class="donate-custom" aria-label="Otro monto">
      </div>
      <div class="modal-payment-methods">
        <button class="payment-method-btn selected" data-method="tarjeta">Tarjeta</button>
        <button class="payment-method-btn" data-method="transferencia">Transferencia</button>
        <div class="payment-fields" id="payment-fields"></div>
      </div>
      <button class="donate-confirm">Confirmar donación</button>
      <div class="donate-success" style="display:none;"></div>
    `;
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
    setupModalEvents();
    setupPaymentMethods();
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
    // Selección de monto
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
    // Confirmar donación
    const confirmBtn = modalBody.querySelector('.donate-confirm');
    const successMsg = modalBody.querySelector('.donate-success');
    confirmBtn.addEventListener('click', () => {
      const selectedMethodBtn = modalBody.querySelector('.payment-method-btn.selected');
      const method = selectedMethodBtn ? selectedMethodBtn.dataset.method : 'tarjeta';
      const amount = selectedAmount || customInput.value;
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        successMsg.style.display = 'block';
        successMsg.textContent = 'Por favor, ingresa un monto válido.';
        successMsg.style.color = '#dc2626';
        return;
      }
      confirmBtn.disabled = true;
      successMsg.style.display = 'block';
      successMsg.style.color = '#16a34a';
      successMsg.textContent = `¡Gracias por tu donación de $${amount} por ${method}!`;
      setTimeout(() => {
        closeModal();
      }, 2000);
    });
  }
  
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  }
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.category);
    });
  });
  
  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    filterBtns[0].classList.add('active');
  });
  