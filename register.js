// En tu archivo register.html, justo antes de </body>, o en un archivo register.js
// <script src="register.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío por defecto del formulario

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // --- Validaciones BÁSICAS ---
        if (!username || !email || !password || !confirmPassword) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        if (password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        // Validar formato de email (simple)
        if (!email.includes('@') || !email.includes('.')) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

        // --- Simular almacenamiento de usuario ---
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el email o username ya existen (simulado)
        if (users.some(u => u.email === email)) {
            alert('Este correo electrónico ya está registrado.');
            return;
        }
        if (users.some(u => u.username === username)) {
            alert('Este nombre de usuario ya está en uso.');
            return;
        }

        const newUser = { username, email, password }; // Contraseña sin cifrar (SOLO PARA DEMO)
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        window.location.href = 'login.html?registered=true'; // Redirigir a login con un parámetro
    });
});