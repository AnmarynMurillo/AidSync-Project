document.addEventListener('DOMContentLoaded', function() {
    const donateButtons = document.querySelectorAll('.donate-button');
    const modal = document.getElementById('donateModal');
    const closeModal = document.querySelector('.close');
    const donationForm = document.getElementById('donationForm');

    donateButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    donationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Thank you for your donation!');
        modal.style.display = 'none';
    });

    const cardDescriptions = document.querySelectorAll('.card-description');
    cardDescriptions.forEach(description => {
        description.addEventListener('click', function() {
            this.classList.toggle('expanded');
            this.style.maxHeight = this.classList.contains('expanded') ? this.scrollHeight + 'px' : '80px';
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const donateBtns = document.querySelectorAll('.donate-btn');
    const modal = document.getElementById('donateModal');
    const closeBtn = document.querySelector('.close-btn');
    const descriptionParas = document.querySelectorAll('.card p.description');

    donateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    descriptionParas.forEach(para => {
        para.addEventListener('click', () => {
            para.classList.toggle('expanded');
        });
    });

    // Form submit handling can be added here
});
document.addEventListener('DOMContentLoaded', () => {
    const donateBtns = document.querySelectorAll('.donate-btn');
    const modal = document.getElementById('donateModal');
    const closeBtn = document.querySelector('.close-btn');
    const descriptionParas = document.querySelectorAll('.card p.description');
    const cards = document.querySelectorAll('.card');

    donateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    descriptionParas.forEach(para => {
        para.addEventListener('click', () => {
            para.classList.toggle('expanded');
        });
    });

    cards.forEach(card => {
        card.addEventListener('mousedown', () => {
            card.classList.add('expanded');
        });

        card.addEventListener('mouseup', () => {
            card.classList.remove('expanded');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('expanded');
        });
    });

    // Form submit handling can be added here
});
// para crear el icono del usuarios

const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Create the user icon
    const userIcon = document.getElementById('userIcon');
    const initial = user.username.charAt(0).toUpperCase();

    userIcon.textContent = initial;
    userIcon.title = user.username; // Set the title to show the username on hover
}

