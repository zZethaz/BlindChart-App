// En tu archivo login.html, justo antes de </body>, o en un archivo login.js
// <script src="login.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const successMessageDiv = document.querySelector('.success-message');

    // Check if redirected from registration success
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
        if (successMessageDiv) {
            successMessageDiv.style.display = 'flex'; // Show the success message
            // Remove the 'registered' param from URL after showing
            const url = new URL(window.location.href);
            url.searchParams.delete('registered');
            window.history.replaceState({}, document.title, url.toString());
        }
    }
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío por defecto del formulario

        const email = emailInput.value;
        const password = passwordInput.value;

        // Recuperar usuarios de localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Buscar el usuario
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Simular inicio de sesión exitoso
            localStorage.setItem('loggedInUser', user.username); // Guardar el nombre de usuario logueado
            alert('¡Inicio de sesión exitoso!');
            window.location.href = 'index.html'; // Redirigir al dashboard
        } else {
            alert('Correo electrónico o contraseña incorrectos.');
            // Aquí podrías mostrar un mensaje de error en la UI
        }
    });
});