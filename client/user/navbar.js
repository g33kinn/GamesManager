document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.innerHTML = `
        <a class="nav-link" href="C:/Programming/Web/GamesManager/GamesManager/client/user/games/catalog/catalog.html"><span>Каталог</span></a>
        <a class="nav-link" href="C:/Programming/Web/GamesManager/GamesManager/client/user/games/library/library.html"><span>Библиотека</span></a>
        <a class="nav-link" href="C:/Programming/Web/GamesManager/GamesManager/client/user/account/profile/profile.html"><span>Профиль</span></a>
        <div class="login-register-links">
            <a class="login-register-link" href="C:/Programming/Web/GamesManager/GamesManager/client/user/account/login/login.html">Войти</a>
            <a class="login-register-link" href="C:/Programming/Web/GamesManager/GamesManager/client/user/account/register/register.html">Регистрация</a>
        </div>`;
    }
})