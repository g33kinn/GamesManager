let currentPage = 1;
let isLoading = false;
let isEmpty = true;

$(document).ready(async function() {
    await import('../scripts/navbar.js');
    $('#navbar .nav-link:nth-child(1) span').addClass('active');
    getGames();
});

function openFilterList(listID) {
    $('#' + listID).toggleClass('d-none');
}

function toggleCheckbox(checkboxID) {
    $('#' + checkboxID).prop('checked', function() {
        return !$(this).prop('checked');
    });
}

const getGames = async (page = 1, append = false) => {
    const search = $('#searchInput').val();

    const response = await $.get(`/games?gameName=${search}&page=${page}`);

    $('#message').text('');
    if (!append) {
        isEmpty = true;
        const catalog = document.getElementById('catalog');
        let child = catalog.firstChild;
    
        while (child) {
            const nextSibling = child.nextSibling; 
            if (child.tagName !== 'TEMPLATE') catalog.removeChild(child); 
            child = nextSibling; 
        }
    }
    
    if (isEmpty && response.message) {
        $('#message').text(response.message);
        return;
    }
    else if (!response.hasOwnProperty('message')) {
        const gameCardTemplate = document.getElementById('gameCardTemplate');
        response.forEach(game => {
            const gameCard = gameCardTemplate.content.cloneNode(true);
            const article = gameCard.querySelector('.catalog-item');
    
            gameCard.querySelector('.game-name-span').textContent = game.gameName;
    
            article.addEventListener('click', function() {
                window.location.href = `/catalog/${game.gameName}`;
            });
            catalog.appendChild(gameCard);
        });
        currentPage = page;
        isEmpty = false;
    }
}

const handleScroll = () => {
    const distanceToBottom = $(document).height() - $(window).scrollTop() - $(window).height();
    if (distanceToBottom < 100) {
        if (!isLoading) {
            isLoading = true;
            setTimeout(async () => {
                await getGames(currentPage + 1, true);
                isLoading = false;
            }, 1000);
        }
    }

};

$(window).on('scroll', handleScroll);

$('#searchInput').on('input', function() {
    currentPage = 1;
});