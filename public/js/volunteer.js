// volunteer.js: Lógica para galería de voluntariados y modal

// Datos de ejemplo (puedes reemplazar por fetch a backend/Firebase)
const VOLUNTEERS = [
    {
      id: 1,
      nombre: 'Casa Esperanza/ tutoring',
      categoria: 'educacion',
      color: '#2563eb',
      colorHover: '#1d4ed8',
      img: '../assets/img/volunter/casaEsperanza.jpg',
      desc: 'Help children and young people improve their academic performance.',
      descLarga: 'Be part of our team of volunteers for the Casa Esperanza Summer School and together we help strengthen the learning of the children and adolescents in our programs.',
      ubicacion: 'C. la Esperanza 70, Aguadulce, Provincia de Coclé',
      mapa: `<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=-80.5381%2C8.2319%2C-80.5355%2C8.2338&amp;layer=mapnik&amp;marker=8.23285%2C-80.53681"  style="border:1px solid black"></iframe>`,
      requisitos: ['Over 16 years old',
      ' Knowledge in the subjects of: Spanish, mathematics, English, physics, chemistry and accounting.',
      ' Be responsible. committed and punctual.','Reside in the provinces of Panama, Coclé, Colón, Herrera and Chiriquí.',
      'Have good management of a group of children from 6 to 11 years old and adolescents from 12 to 17 years old.'],
    },
    {
      id: 2,
      nombre: 'Global Brigades Panama',
      categoria: 'salud',
      color: '#dc2626',
      colorHover: '#b91c1c',
      img: '../assets/img/volunter/Brigadas.jpg',
      desc: 'Global Brigades Panama is an international organization that connects volunteers with vulnerable communities to provide medical, dental, and health education services through short-term brigades.',
      descLarga: 'Become a volunteer and help bring vital healthcare and education to communities in need.',
      ubicacion: '1003 Calle 60 Oeste, Panamá, Provincia de Panamá, PA',
      mapa:'<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-79.5377%2C8.9903%2C-79.5327%2C8.9933&amp;layer=mapnik&amp;marker=8.991856529315962%2C-79.53523216208009"  style="border:1px solid black"></iframe>',
      requisitos: ['Valid passport (at least 6 months before expiration)',
      'Must be 18+ years old (or have parental permission)',
      'Fundraise between $2,440 and $2,640 USD',
      'Availability for 7 consecutive days',
      'Attend pre-trip orientation sessions', 
      'Basic Spanish proficiency', 
      'Physical ability for community work',
      'Respect for local cultural norms',
      'Adaptability to rural conditions', 
      'No criminal record', 
      'Willingness to work as part of a team']
    },
    {
      id: 3,
      nombre: 'Natura/ Reforestación Urbana',
      categoria: 'ambiente',
      color: '#16a34a',
      colorHover: '#15803d',
      desc: 'Join as a volunteer for reforestation events or school/community campaigns..',
      descLarga: ' It is a nonprofit working in Bahía Piñas, Darién, to support reforestation, education, and community health in one of the most remote areas of Panama.',
      ubicacion: 'Llanos de Curundu, Edificio 1992 A-B, Ancón, Ciudad de Panamá, Panamá.',
      mapa:'<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-79.5513%2C8.9785%2C-79.5473%2C8.9815&amp;layer=mapnik&amp;marker=8.980028423107049%2C-79.54932847557309" style="border:1px solid black"></iframe>',
      requisitos: ['Commitment to the environmental cause','Availability of time',
      'Physical ability','Minimum age (18 years or younger with authorization)','Teamwork and positive attitude', 'Participation in informational or orientation sessions', 'Compliance with safety protocols'],
      img:'../assets/img/volunter/Reforestacion.jpeg',
    },
    {
      id: 4,
      nombre: 'Banco de Alimentos Panamá',
      categoria: 'bienestar',
      color: '#eab308',
      colorHover: '#ca8a04',
      desc: ' It is a non-profit organization that combats hunger and malnutrition by rescuing surplus food and distributing it to vulnerable communities throughout Panama.',
      descLarga: 'Join us as a volunteer and support the collection, sorting, and delivery of food to those in need.',
      ubicacion: 'Vía Circunvalación, Las Mañanitas, Tocumen, Panamá',
      mapa: '<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"  src="https://www.openstreetmap.org/export/embed.html?bbox=-79.3999%2C9.0873%2C-79.3959%2C9.0903&layer=mapnik&marker=9.088846170013202%2C-79.3978560319548"  style="border:1px solid black"></iframe>',
      requisitos: ['Strong social commitment and willingness to help', 'Be at least 16 years old (or younger with permission)','Availability (weekdays or weekends)','Teamwork and collaborative attitude','Follow hygiene and safety rules','Attend an orientation or information session', 'Be punctual and comply with assigned schedules','Wear appropriate clothing (closed shoes, no loose accessories)'],
      img:  '../assets/img/volunter/banco.jpg',
    },
    {
      id: 5,
      nombre: 'Socios en Salud (SES)',
      categoria: 'salud',
      color: '#dc2626',
      colorHover: '#b91c1c',
      desc: 'It is interested in partnering with volunteers and educational institutions in a variety of community and global health research internships.',
      descLarga: ' Volunteers have the opportunity to contribute to SES’s social justice–oriented initiatives while gaining experience in the field of public health, learning about health system strengthening, and interventions in key populations.',
      ubicacion: ' Av. Los Constructores 1230, La Molina.',
      mapa:'<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-79.5268%2C8.9750%2C-79.5188%2C8.9790&amp;layer=mapnik&amp;marker=8.977022751103211%2C-79.5228045044088" style="border:1px solid black"></iframe>',
      requisitos: ['Adult (18+ years old)',' Advanced or native Spanish-speaking skills To engage and intervene in the community,having direct contact with community health workers and beneficiaries.',
      ,' 30+ hours of availability, Monday to Friday Although part-time remote volunteer positions exist, in-person and international positions are full-time.', 'If you are taking an online class or have other intermittent time commitments, scheduled volunteer hours can generally be adjusted accordingly.'
      ,'Dedication to social justice and health equity Through relevant prior coursework or previous professional experience.'],
      img:'../assets/img/volunter/Centrodesalu.png',
    },
    {
      id: 6,
      nombre: 'Cruz Roja',
      categoria: 'salud',
      color: '#dc2626',
      colorHover: '#b91c1c',
      desc: 'Cruz Roja Juventud is made up of children and young people between the ages of five and thirty, who carry out national and international activities based on the fundamental principles, objectives, and policies of the International Red Cross and Red Crescent Movement.',
      descLarga: ' In particular, it promotes inclusion, tolerance, understanding, peace, and non-violence. It offers a variety of volunteer activities related to health and community well-being.',
      ubicacion: ' Belisario Porras, San Miguelito, Provincia de Panamá',
      mapa:'<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-79.502127%2C9.042951%2C-79.494127%2C9.046951&amp;layer=mapnik&amp;marker=9.044951%2C-79.498127" style="border:1px solid black"></iframe>',
      requisitos: ['Any adult interested in helping others.', 'In Panama, the Cruz Roja de la Juventud accepts underage volunteers with parental or guardian authorization.','Some volunteer areas may require specific knowledge, such as first aid or pre-hospital care, or participation in courses and training programs.'],
      img:'../assets/img/volunter/Cruz roja.jpg',
    },
    {
      id: 7,
      nombre: 'Ayudinga',
      categoria: 'educacion',
      color: '#2563eb',
      colorHover: '#1d4ed8',
      img: '../assets/img/volunter/ayudinga.webp',
      desc: 'We offer courses in mathematics, physics, chemistry, and biology, with the necessary resources to make your education as complete as possible. Our programs are primarily aimed at fostering learning and academic excellence in the STEM field through distance education.',
      descLarga: 'Telling the stories of outstanding individuals or those who have generated a social impact in the community.',
      ubicacion: '137, C. Evelio Lara, Panamá, Provincia de Panamá',
      mapa: `<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-79.58624367742297%2C8.994949923096338%2C-79.57824367742297%2C8.998949923096338&amp;layer=mapnik&amp;marker=8.996949923096338%2C-79.58224367742297" style="border:1px solid black"></iframe>`,
      requisitos: ['Be of legal age (18 years or older).','Have a desire to learn and to teach.','Show commitment to the cause.'],
    },
    {
      id: 8,
      nombre: 'Moving Lives Foundation',
      categoria: 'educacion',
      color: '#2563eb',
      colorHover: '#1d4ed8',
      img: '../assets/img/volunter/moviendovidas.jpg',
      desc: 'Moviendo Vidas Foundation was born as an initiative of Grupo Panamá Car Rental, S.A., committed to education, opportunities, and the future of Panama. ,We believe in the transformative power of art. Through free music classes, we support children and young people from vulnerable communities on a path of expression, confidence, and personal development.',
      descLarga: 'Every note is a tool to dream big and build a better future.',
      requisitos: ['Email: infofmv@grupopcr.com.pa','WhatsApp: +507 6997-5782'],
    },
    {
      id: 9,
      nombre: 'Water and Earth Foundation',
      categoria: 'ambiente',
      color: '#16a34a',
      colorHover: '#15803d',
      desc: 'For the protection, conservation, and sustainable management of sea turtles, as well as sustainable community development in Mata Oscura de Quebro, in the district of Mariato, within the Special Coastal Marine Management Zone (ZEMMC) in the Southern Zone of Veraguas, on Panama’s Pacific coast',
      descLarga: 'This volunteer opportunity lets you learn about sea turtles and rural communities, join field activities that strengthen your résumé, and contribute to environmental conservation, while experiencing a simple and different lifestyle.',
      ubicacion: ' La Loma, Provincia de Veraguas',
      mapa:'<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-80.9357%2C7.4627%2C-80.9277%2C7.4667&amp;layer=mapnik&amp;marker=7.464707907666383%2C-80.93167508908252" style="border:1px solid black"></iframe>',
      requisitos: ['Be 18+ (or with a responsible adult).','Availability between June and March.','Good physical condition.','Positive attitude and cultural respect.','Cover own transport and accommodation.','Participate in the foundation’s induction.','Contact the foundation in advance to coordinate'],
      img:'../assets/img/volunter/aguaytierra.jpg',
    },
    {
      id: 10,
      nombre: 'Clean Panama Foundation',
      color: '#16a34a',
      colorHover: '#15803d',
      desc: 'Fundación Limpia Panamá was founded in 2019 with the goal of raising awareness among the population about the proper management of waste in public areas. We want to grow and, in this way, achieve change',
      descLarga: 'Be a volunteer and be part of the solution through our Volunteer Program.',
      ubicacion: ' Balboa Office Center, en la Avenida Balboa, Panamá',
      mapa:'<iframe width="100%" height="180" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-79.5254%2C9.0100%2C-79.5174%2C9.0140&amp;layer=mapnik&amp;marker=9.012076222566721%2C-79.52142514637735" style="border:1px solid black"></iframe>',
      requisitos: ['Be proactive and committed.', 'Have availability to participate in clean-up and reforestation events.' ,'Show respect and teamwork skills.','Volunteer services are unpaid and done in favor of the community.' , 'Ensure attendance in scheduled activities; notify if you must withdraw early.' ,'Confirm your participation in advance when required.'],
      img:'../assets/img/volunter/limpia.webp',
    },
    {
      id: 11,
      nombre: 'Friends of Children with Leukemia and Cancer Foundation (FANLYC)',
      categoria: 'bienestar',
      color: '#eab308',
      colorHover: '#ca8a04',
      desc: 'FANLYC (Fundación Amigos del Niño con Leucemia y Cáncer) is a non-profit organization in Panama dedicated to providing comprehensive support to children diagnosed with cancer.',
      descLarga: 'Help bring hope, support, and love to children battling cancer in Panama. Volunteer, donate, or spread awareness—every action counts toward improving their lives and creating a brighter future..',
      ubicacion: 'Corregimiento de Calidonia, Avenida México con Calle 33 Este en la Ciudad de Panamá',
      mapa: '<iframe width="100%" height="180" frameborder="0" scrolling="no"  marginheight="0" marginwidth="0"  src="https://www.openstreetmap.org/export/embed.html?bbox=-79.5360%2C8.9658%2C-79.5320%2C8.9698&layer=mapnik&marker=8.967860234488137%2C-79.53402616023037"  style="border:1px solid black"></iframe>',
      requisitos: ['Be at least 18 years old.','Have a passion for helping children and families.','Be responsible, punctual, and committed to volunteer activities.','Be willing to follow Fanlyc’s rules and guidelines.','Preferably have some experience or interest in social work, education, or community support.','Able to commit a minimum number of hours per week/month (depending on the program).'],
      img:  '../assets/img/volunter/fanlyc.jpg',
    },
  ];
  
  const gallery = document.getElementById('volunteer-gallerys');
  const modal = document.getElementById('volunteer-modal');
  const modalBody = modal.querySelector('.modal-body');
  const closeBtn = modal.querySelector('.modal-close');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  function renderCards(category = 'all') {
    gallery.innerHTML = '';
    VOLUNTEERS.filter(v => category === 'all' || v.categoria === category)
      .forEach(v => {
        const card = document.createElement('div');
        card.className = 'volunteer-card';
        card.style.setProperty('--cat-color', v.color);
        card.style.setProperty('--cat-color-hover', v.colorHover);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', v.nombre);
        card.innerHTML = `
          <img src="${v.img}" alt="${v.nombre}">
          <div class="card-content">
            <div class="card-title">${v.nombre}</div>
            <div class="card-desc">${v.desc}</div>
          </div>
        `;
        card.addEventListener('click', () => openModal(v));
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(v); });
        gallery.appendChild(card);
      });
  }
  
  function openModal(vol) {
    modalBody.innerHTML = `
      <img src="${vol.img}" alt="${vol.nombre}">
      <h2>${vol.nombre}</h2>
      <div class="modal-desc">${vol.descLarga}</div>
      <div class="modal-map">${vol.mapa}</div>
      <ul class="modal-reqs">
        ${vol.requisitos.map(r => `<li>${translateRequirement(r)}</li>`).join('')}
      </ul>
      <button id="modal-signup">Sign Up</button>
    `;
    const signupBtn = document.getElementById('modal-signup');
    signupBtn.addEventListener('click', () => {
      // Redirige a la página de registro
      window.location.href = '/public/pages/register.html'; // Cambia la ruta si es diferente, por ejemplo: '/registro'
    });
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
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
  renderCards();
  filterBtns[0].classList.add('active');
  
  // Helper function to translate requirements to English
  function translateRequirement(req) {
    const translations = {
      'Mayoría de edad': 'Over 18 years old',
      'Experiencia en salud (deseable)': 'Experience in health (desirable)',
      'Actitud de servicio': 'Service attitude',
      'Ser mayor de 15 años': 'Over 15 years old',
      'Gusto por la naturaleza': 'Interest in nature',
      'Disponibilidad fines de semana': 'Available on weekends',
      'Empatía y responsabilidad': 'Empathy and responsibility',
      'Trabajo en equipo': 'Teamwork',
      '- Reside in the provinces of Panama, Coclé, Colón, Herrera and Chiriquí.': 'Reside in the provinces of Panama, Coclé, Colón, Herrera, and Chiriquí.',
      ' Be responsible. committed and punctual.': 'Be responsible, committed, and punctual.',
      ' Knowledge in the subjects of: Spanish, mathematics, English, physics, chemistry and accounting.': 'Knowledge in Spanish, mathematics, English, physics, chemistry, and accounting.',
      'Have good management of a group of children from 6 to 11 years old and adolescents from 12 to 17 years old.': 'Good management of groups of children (6-11) and adolescents (12-17).'
    };
    return translations[req] || req;
  }