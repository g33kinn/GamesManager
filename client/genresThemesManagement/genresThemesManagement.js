let genresCount = 0;
let themesCount = 0;

$(document).ready(async function() {
    await import('../scripts/navbarCatalogManager.js');
    $('#navbar .nav-link:nth-child(2) span').addClass('active');
    await getGenres();
    await getThemes();
});

const getGenres = async () => {
    const response = await $.get(`/genres`);

    $('#gamesMessage').text('');
    const genresBody = document.getElementById('genresBody');
    genresCount = 0;
    let child = genresBody.firstChild;
    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') genresBody.removeChild(child); 
        child = nextSibling; 
    }
    if (response.message) {
        const noGenresCardTemplate = document.getElementById('noGenresCardTemplate');
        const noGenresCard = noGenresCardTemplate.content.cloneNode(true);
        noGenresCard.querySelector('#genresMessage').querySelector('td').textContent = response.message;
        genresBody.appendChild(noGenresCard);
        return;
    }
    else if (!response.hasOwnProperty('message')) {
        const genreCardTemplate = document.getElementById('genreCardTemplate');
        response.forEach(genre => {
            genresCount++;
            const genreCard = genreCardTemplate.content.cloneNode(true);
            genreCard.querySelector('#id').textContent = genresCount;
            genreCard.querySelector('#genreName').textContent = genre.name;
            genreCard.querySelector('#actions').innerHTML = `
                <img id="updateGenreBtn" src="../assets/img/update.png" class="update-img cursor-pointer" width="20px" height="20px" alt="">
                <img id="deleteGenreBtn" src="../assets/img/delete.png" class="delete-img cursor-pointer" width="20px" height="20px" alt="">
            `;
            genreCard.querySelector('#updateGenreBtn').addEventListener('click', function() {
                updateGenre(genre);
            });
            genreCard.querySelector('#deleteGenreBtn').addEventListener('click', function() {
                deleteGenre(genre);
            });
            genresBody.appendChild(genreCard);
        });
    }
}

const getThemes = async () => {
    const response = await $.get(`/themes`);

    $('#gamesMessage').text('');
    const themesBody = document.getElementById('themesBody');
    themesCount = 0;
    let child = themesBody.firstChild;
    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') themesBody.removeChild(child); 
        child = nextSibling; 
    }
    if (response.message) {
        const noThemesCardTemplate = document.getElementById('noThemesCardTemplate');
        const noThemesCard = noThemesCardTemplate.content.cloneNode(true);
        noThemesCard.querySelector('#themesMessage').querySelector('td').textContent = response.message;
        themesBody.appendChild(noThemesCard);
        return;
    }
    else if (!response.hasOwnProperty('message')) {
        const themeCardTemplate = document.getElementById('themeCardTemplate');
        response.forEach(theme => {
            themesCount++;
            const themeCard = themeCardTemplate.content.cloneNode(true);
            themeCard.querySelector('#id').textContent = themesCount;
            themeCard.querySelector('#themeName').textContent = theme.name;
            themeCard.querySelector('#actions').innerHTML = `
                <img id="updateThemeBtn" src="../assets/img/update.png" class="update-img cursor-pointer" width="20px" height="20px" alt="">
                <img id="deleteThemeBtn" src="../assets/img/delete.png" class="delete-img cursor-pointer" width="20px" height="20px" alt="">
            `;
            themeCard.querySelector('#updateThemeBtn').addEventListener('click', function() {
                updateTheme(theme);
            });
            themeCard.querySelector('#deleteThemeBtn').addEventListener('click', function() {
                deleteTheme(theme);
            });
            themesBody.appendChild(themeCard);
        });
    }
}