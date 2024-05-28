let currentPage = 1;
let isLoading = false;
let isEmpty = true;

$(document).ready(async function() {
    await import('../scripts/navbar.js');
    $('#navbar .nav-link:nth-child(2) span').addClass('active');
    await getLibraryGames();
});

const getLibraryGames = async (page = 1, append = false) => {
    const search = $('#searchInputLib').val();

    const response = await $.get(`/libraryGames?gameName=${search}&page=${page}`);

    $('#message').text('');
    if (!append) {
        isEmpty = true;
        const lib = document.getElementById('lib');
        let child = lib.firstChild;
        while (child) {
            const nextSibling = child.nextSibling; 
            if (child.tagName !== 'TEMPLATE') lib.removeChild(child); 
            child = nextSibling; 
        }
    }
    
    if(isEmpty && response.message) {
        $('#message').text(response.message);
        return;
    }
    else if (!response.hasOwnProperty('message')) {
        const libGameCardTemplate = document.getElementById('libGameCardTemplate');
        response.forEach(game => {
            const libGameCard = libGameCardTemplate.content.cloneNode(true);
            const catalogArticle = libGameCard.querySelector('.game-card-a');
            const deleteArticle = libGameCard.querySelector('.game-card-btn');
    
            libGameCard.querySelector('.d-flex.justify-content-center.game-card-name').textContent = game.gameName;
    
            catalogArticle.addEventListener('click', function() {
                window.location.href = `/catalog/${game.gameName}`;
            });
    
            deleteArticle.addEventListener('click', function() {
                deleteGameFromLibrary(game.gameName);
            })
            lib.appendChild(libGameCard);
        });
        currentPage = page;
        console.log(currentPage);
        isEmpty = false;
    }
}

const deleteGameFromLibrary = async (gameName) => {
    await $.ajax({
        url: `/libraryGames/${gameName}`,
        method: 'DELETE',
    });
    getLibraryGames();
}

const handleScroll = () => {
    const distanceToBottom = $(document).height() - $(window).scrollTop() - $(window).height();
    if (distanceToBottom < 100) {
        if (!isLoading) {
            isLoading = true;
            setTimeout(async () => {
                await getLibraryGames(currentPage + 1, true);
                isLoading = false;
            }, 1000);
        }
    }

};

$(window).on('scroll', handleScroll);

$('#searchInput').on('input', function() {
    currentPage = 1;
});