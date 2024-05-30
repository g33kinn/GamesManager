$(document).ready(async function() {
    await import('../scripts/navbarPlayer.js');
    const $loginForm = $('#loginForm');
    $(window).on('pageshow', function(event) {
        if (event.originalEvent.persisted || (performance && performance.navigation.type === 2)) {
            $('#message').text('');
        }
    });
    $loginForm.on('submit', async function(e) {
        e.preventDefault();

        const userName = $('#login').val();
        const password = $('#pass').val();

        try {
            await $.ajax({
                url: '/login',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ userName, password }),
            });
            window.location.href = '/';
        } catch (error) {
            $('#message').text(error.responseJSON.message);
        }
        
    })
}) 