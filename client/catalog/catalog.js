let currentPage = 1;
let isLoading = false;
let isEmpty = true;
let genres = [];
let themes = [];

$(document).ready(async function() {
    await import('../scripts/navbarPlayer.js');
    $('#navbar .nav-link:nth-child(1) span').addClass('active');
    await getGenres();
    await getThemes();
    await getGames();
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

    
    let url = `/games?gameName=${search}&page=${page}`;
    const genresCheckboxes = document.querySelectorAll('#genre input[type="checkbox"]');
    genresCheckboxes.forEach(el => {
        if (el.checked) {
            const genre = genres.find(genre => genre._id === el.id);
            url += `&genres=${genre.name}`;
        }
    })

    const themesCheckboxes = document.querySelectorAll('#theme input[type="checkbox"]');
    themesCheckboxes.forEach(el => {
        if (el.checked) {
            const theme = themes.find(theme => theme._id === el.id);
            url += `&themes=${theme.name}`;
        }
    })

    const response = await $.get(url);

    $('#message').text('');
    const catalog = document.getElementById('catalog');
    if (!append) {
        isEmpty = true;
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
            gameCard.querySelector('#imageCat').src = `../assets/gameImg/${game.imageCat}`;
            article.addEventListener('click', function() {
                window.location.href = `/catalog/${game.gameName}`;
            });
            catalog.appendChild(gameCard);
        });
        currentPage = page;
        isEmpty = false;
    }
}

const getGenres = async () => {
    genres = await $.get('/genres');
    const gameGenres = document.getElementById('gameGenres');
    let child = gameGenres.firstChild;
    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') gameGenres.removeChild(child); 
        child = nextSibling; 
    }
    if (genres.message) {
        $('#genreMessage').text(`Для жанров: ${genres.message}`);
        return;
    }
    else if (!genres.hasOwnProperty('message')) {
        const genreCardTemplate = document.getElementById('genreCardTemplate');
        genres.forEach(genre => {
            const genreCard = genreCardTemplate.content.cloneNode(true);
            genreCard.querySelector('#genreName').textContent = genre.name;
            genreCard.querySelector('input[type="checkbox"]').id = genre._id;
            genreCard.querySelector('.d-flex.button-filter').addEventListener('click', () => { toggleCheckbox(genre._id); });
            gameGenres.appendChild(genreCard);
        });
    }
}

const getThemes = async () => {
    themes = await $.get('/themes');
    const gameThemes = document.getElementById('gameThemes');
    let child = gameThemes.firstChild;
    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') gameThemes.removeChild(child); 
        child = nextSibling; 
    }
    if (themes.message) {
        $('#themeMessage').text(`Для тематик: ${themes.message}`);
        return;
    }
    else if (!themes.hasOwnProperty('message')) {
        const themeCardTemplate = document.getElementById('themeCardTemplate');
        themes.forEach(theme => {
            const themeCard = themeCardTemplate.content.cloneNode(true);
            themeCard.querySelector('#themeName').textContent = theme.name;
            themeCard.querySelector('input[type="checkbox"]').id = theme._id;
            themeCard.querySelector('.d-flex.button-filter').addEventListener('click', () => { toggleCheckbox(theme._id); });;
            gameThemes.appendChild(themeCard);
        });
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