let genresCount = 0;
let themesCount = 0;

$(document).ready(async function() {
    await import('../scripts/navbarCatalogManager.js');
    $('#navbar .nav-link:nth-child(2) span').addClass('active');
    await getGenres();
    await getThemes();
    $('#addOrEditGenreBtn').on('click', function(event) {
        event.preventDefault();
        addOrEditGenre();
    });
    $('#addOrEditThemeBtn').on('click', function(event) {
        event.preventDefault();
        addOrEditTheme();
    });
});

const resetGenre = () => {
    $('#genreNameInput').val('');
    $('#addOrEditGenreBtn').off('click');
    $('#addOrEditGenreBtn').on('click', function(event) {
        event.preventDefault();
        addOrEditGenre();
    });
    console.log($('#addOrEditGenreBtn').data('events'));
}

const resetTheme= () => {
    $('#themeNameInput').val('');
    $('#addOrEditThemeBtn').off('click');
    $('#addOrEditThemeBtn').on('click', function(event) {
        event.preventDefault();
        addOrEditTheme();
    });
}

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
            genreCard.querySelector('#updateGenreBtn').addEventListener('click', function(event) {
                event.preventDefault();
                $('#genreNameInput').val(genre.name);
                $('#addOrEditGenreBtn').off('click');
                $('#addOrEditGenreBtn').on('click', (event) => {
                    event.preventDefault();
                    addOrEditGenre(genre);
                })
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
            themeCard.querySelector('#updateThemeBtn').addEventListener('click', function(event) {
                event.preventDefault();
                $('#themeNameInput').val(theme.name);
                $('#addOrEditThemeBtn').off('click');
                $('#addOrEditThemeBtn').on('click', (event) => {
                    event.preventDefault();
                    addOrEditTheme(theme);
                })
                
            });
            themeCard.querySelector('#deleteThemeBtn').addEventListener('click', function() {
                deleteTheme(theme);
            });
            themesBody.appendChild(themeCard);
        });
    }
}

const addOrEditGenre = async (genre = null) => {
    if (!!genre) {
        const genreName = $('#genreNameInput').val();
        if (genre.name === genreName)
            return;
        if (genreName) {
            await $.ajax({
                url: `/genres/${genre.name}`,
                method: 'PATCH',
                data: JSON.stringify({ name: genreName }),
                contentType: 'application/json',
                error: function(error) {
                    console.log(error);
                    return;
                }
            });
        }
        else {
            console.log('Genre name is empty');
        }
    }
    else {
        const genreName = $('#genreNameInput').val();
        if (genreName) {
            await $.ajax({
                url: '/genres',
                method: 'POST',
                data: JSON.stringify({ name: genreName }),
                contentType: 'application/json',
                error: function(error) {
                    console.log(error);
                    return;
                }
            });
            await getGenres();
        }
        else {
            console.log('Genre name is empty');
        }
    }
    $('#genreNameInput').val('');
    await getGenres();
}

const addOrEditTheme = async (theme = null) => {
    if (!!theme) {
        const themeName = $('#themeNameInput').val();
        if (themeName) {
            await $.ajax({
                url: `/themes/${theme.name}`,
                method: 'PATCH',
                data: JSON.stringify({ name: themeName }),
                contentType: 'application/json',
                error: function(error) {
                    console.log(error);
                    return;
                } 
            });
        }
    }    
    else {
        const themeName = $('#themeNameInput').val();
        if (themeName) {
            await $.ajax({
                url: '/themes',
                method: 'POST',
                data: JSON.stringify({ name: themeName }),
                contentType: 'application/json',
                error: function(error) {
                    console.log(error);
                    return;
                }
            });
        }
        else {
            console.log('Theme name is empty');
        }
    }
    $('#themeNameInput').val('');
    await getThemes();
}

const deleteGenre = async (genre) => {
    await $.ajax({
        url: `/genres/${genre.name}`,
        method: 'DELETE',
        error: function(error) {
            console.log(error);
            return;
        }
    });
    await getGenres();
}

const deleteTheme = async (theme) => {
    await $.ajax({
        url: `/themes/${theme.name}`,
        method: 'DELETE',
        error: function(error) {
            console.log(error);
            return;
        }
    });
    await getThemes();
}