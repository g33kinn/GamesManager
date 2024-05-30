const navbar = $('#navbar');

navbar.html(`
    <a class="nav-link" href="/catalogManagement"><span>Игры</span></a>
    <a class="nav-link" href="/genresThemesManagement"><span>Жанры и тематики</span></a>
    <div class="login-register-links">
        <a class="login-register-link" href="/logout">Выйти</a>
    </div>
`);