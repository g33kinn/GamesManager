let profile;

$(document).ready(async function() {
    await import('../scripts/navbar.js');
    $('#navbar .nav-link:nth-child(3) span').addClass('active');
    $(window).on('pageshow', function(event) {
        if (event.originalEvent.persisted || (performance && performance.navigation.type === 2)) {
            $('#message').addClass('d-none');
        }
    });
    await getProfile();
});

const getProfile = async () => {
    profile = await $.get('/user');
    document.title = profile.userName;
    $('#login').val(profile.userName);
    $('#email').val(profile.email);
    $('#phoneNumber').val(profile.phoneNumber);
    $('#behavIndex').text(`Ваш индекс поведения: ${profile.behaviourIndex} 
        ${profile.behaviourIndex === 5 ? '(Отличный)' : 
        profile.behaviourIndex === 4 ? '(Хороший)' :
        profile.behaviourIndex === 3 ? '(Средний)' :
        profile.behaviourIndex === 2 ? '(Плохой)' : ''}`);
}

const updateProfile = async () => {
    const email = $('#email').val();
    const phoneNumber = $('#phoneNumber').val();
    const password = $('#pass').val();
    const repeatPass = $('#repeatPass').val();

    let newUserInfo = {};

    if (email && email !== profile.email) newUserInfo.email = email;
    if (phoneNumber && phoneNumber !== profile.phoneNumber) {
        if (phoneNumber.length < 11 || phoneNumber.length > 12) {
            $('#message').removeClass('d-none');
            $('#message').addClass('d-block');
            $('#message').text('Номер телефона должен содержать 11 или 12 цифр');
            return;
        }
        newUserInfo.phoneNumber = phoneNumber;
    } 
    if (password) {
        if (password !== repeatPass) {
            $('#message').removeClass('d-none');
            $('#message').addClass('d-block');
            $('#message').text('Пароли не совпадают');
            return;
        }
        else if (password.length < 4) {
            $('#message').removeClass('d-none');
            $('#message').addClass('d-block');
            $('#message').text('Пароль должен содержать не менее 4 символов');
            return;
        }
        newUserInfo.password = password;
    } 


    const response = await $.ajax({
        url: '/user',
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(newUserInfo),
    });
    $('#message').removeClass('d-none');
    $('#message').addClass('d-block');
    $('#message').text(response.message);
    await getProfile();
}
