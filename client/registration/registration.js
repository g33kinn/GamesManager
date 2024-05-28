$(document).ready(async function() {
    await import('../scripts/navbar.js');
    $('#navbar .nav-link:nth-child(3) span').addClass('active');
    const $registrationForm = $('#registrationForm');
    $('[name="phoneNumber"]').on('input', function() {
        var inputValue = $(this).val().trim(); 
        $(this).val(inputValue.replace(/\D/g, '')); 
    });
    $(window).on('pageshow', function(event) {
        if (event.originalEvent.persisted || (performance && performance.navigation.type === 2)) {
            $('#message').text('');
        }
    });
    $registrationForm.on('submit', async function(e) {
        e.preventDefault();

        const userName = $('[name="login"]').val();
        const password = $('[name="pass"]').val();
        const phoneNumber = $('[name="phoneNumber"]').val();
        const email = $('[name="email"]').val();

        if (!userName || !password || !phoneNumber || !email) {
            $('#message').text('Заполните все поля');
            return;
        }

        if ($('[name="phoneNumber"]').val().length < 11 || $('[name="phoneNumber"]').val().length > 12) {
            $('#message').text('Номер телефона должен содержать 11 или 12 цифр');
            return;
        }

        if (password.length < 4) {
            $('#message').text('Пароль должен содержать не менее 4 символов');
            return;
        }
        
        const repeatPassword = $('[name="repeatPass"]').val();

        if (password !== repeatPassword) {
            $('#message').text('Пароли не совпадают');
            return;
        }
        try {
            await $.ajax({
                url: '/registration',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ userName, password, phoneNumber, email }),
            });
            window.location.href = '/login';
        } catch (error) {
            $('#message').text(error.responseJSON.message);
        }
        
    })
}) 