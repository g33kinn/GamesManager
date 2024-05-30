const navbar = $('#navbar');

const isAuthenticated = document.cookie.split('=')[1] === 'true';

if (isAuthenticated) {
    navbar.html(`
            <a class="nav-link" href="/catalog"><span>Каталог</span></a>
            <a class="nav-link" href="/library"><span>Библиотека</span></a>
            <a class="nav-link" href="/profile"><span>Профиль</span></a>
            <div class="login-register-links">
                <a class="login-register-link" href="/logout">Выйти</a>
            </div>
        `);
} else {
    navbar.html(`
            <a class="nav-link" href="/catalog"><span>Каталог</span></a>
            <a class="nav-link" href="/library"><span>Библиотека</span></a>
            <a class="nav-link" href="/profile"><span>Профиль</span></a>
            <div class="login-register-links">
                <a class="login-register-link" href="/login">Войти</a>
                <a class="login-register-link" href="/registration">Регистрация</a>
            </div>
        `);
}