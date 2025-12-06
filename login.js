document.addEventListener('DOMContentLoaded', function() {
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        clearMessages();
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        clearMessages();
    });

    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        clearMessages();
        const username = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            showMessage(registerMessage, 'Passwords do not match!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.username === username || user.email === email);
        if (existingUser) {
            showMessage(registerMessage, 'Username or email already exists!', 'error');
            return;
        }

        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        showMessage(registerMessage, 'Account created successfully! Please log in.', 'success');
        setTimeout(() => {
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            clearMessages();
        }, 2000);
    });

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearMessages();
    const username = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage(loginMessage, 'Invalid username or password!', 'error');
    }
});

});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    const toggle = input.nextElementSibling;
    toggle.textContent = type === 'password' ? '👁️' : '🙈';
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

function clearMessages() {
    document.querySelectorAll('.message').forEach(msg => {
        msg.textContent = '';
        msg.className = 'message';
    });
}

if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}