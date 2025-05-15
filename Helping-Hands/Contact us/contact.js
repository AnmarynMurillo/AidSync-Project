document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Aquí puedes agregar la lógica para enviar el formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Message sent successfully!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);

    // Limpiar el formulario después de enviar
    document.getElementById('contactForm').reset();
});
const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Create the user icon
    const userIcon = document.getElementById('userIcon');
    const initial = user.username.charAt(0).toUpperCase();

    userIcon.textContent = initial;
    userIcon.title = user.username; // Set the title to show the username on hover
}