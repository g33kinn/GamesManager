const navbar = $('#navbar');

navbar.html(`
    <a class="nav-link" href="/reviewManagement"><span class='active'>Отзывы</span></a>
    <div class="login-register-links">
        <a class="login-register-link" href="/logout">Выйти</a>
    </div>
`);