document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.innerHTML = `
        <a class="nav-link" href="/catalog"><span>Каталог</span></a>
        <a class="nav-link" href="/library"><span>Библиотека</span></a>
        <a class="nav-link" href="/profile"><span>Профиль</span></a>
        <div class="login-register-links">
            <a class="login-register-link" href="/login">Войти</a>
            <a class="login-register-link" href="/register">Регистрация</a>
        </div>`;
    }
})