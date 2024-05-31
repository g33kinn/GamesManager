let currentPage = 1;
let isLoading = false;
let isEmpty = true;
let gamesCount = 0;
let genres = [];
let themes = [];

$(document).ready(async function() {
    await import('../scripts/navbarCatalogManager.js');
    $('#navbar .nav-link:nth-child(1) span').addClass('active');
    await getGames();
    await getGenres();
    await getThemes();
});

const getGenres = async () => {
    genres = await $.get('/genres');
    
    const gameGenresSelect = document.getElementById('gameGenresSelect');
    
    let child = gameGenresSelect.firstElementChild;

    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') gameGenresSelect.removeChild(child); 
        child = nextSibling; 
    }
    if (genres.hasOwnProperty('message')) {
        $('#genreMessage').text(`Для жанров: ${genres.message}`);
        return;
    }
    else if (!genres.hasOwnProperty('message')) {
        const genreCardTemplate = document.getElementById('genreCardTemplate');
        genres.forEach(genre => {
            const genreCard = genreCardTemplate.content.cloneNode(true);
            genreCard.querySelector('option').value = genre.name;
            genreCard.querySelector('option').textContent = genre.name;
            gameGenresSelect.appendChild(genreCard);
        });
    }
}

const getThemes = async () => {
    themes = await $.get('/themes');
    const gameThemesSelect = document.getElementById('gameThemesSelect');
    let child = gameThemesSelect.firstElementChild;

    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') gameThemesSelect.removeChild(child); 
        child = nextSibling; 
    }
    if (themes.hasOwnProperty('message')) {
        $('#themeMessage').text(`Для тематик: ${themes.message}`);
        return;
    }
    else if (!themes.hasOwnProperty('message')) {
        const themeCardTemplate = document.getElementById('themeCardTemplate');
        themes.forEach(theme => {
            const themeCard = themeCardTemplate.content.cloneNode(true);
            themeCard.querySelector('option').value = theme.name;
            themeCard.querySelector('option').textContent = theme.name;
            gameThemesSelect.appendChild(themeCard);
        });
    }
}

const dialog = document.getElementById('gameDialog');

function openAddGameDialog(event) {
    $('#addGameDialogBtn').removeClass('d-none');
    $('#addGameDialogBtn').addClass('d-inline-block');
    $('#addGameDialogBtn').text('Добавить');
    $('#gameForm').off('submit');
    $('#gameForm').on('submit', async function(event) {
        event.preventDefault();
        const gameName = $('#gameName').val();
        const description = $('#gameDescription').val();
        const releaseDate = $('#gameReleaseDate').val();
        const developer = $('#gameDeveloper').val();

        let genres = [];
        const gameGenresSelect = document.getElementById('gameGenresSelect');
        const genreOptions = gameGenresSelect.options;
        for (let i = 0; i < genreOptions.length; i++) {
            const option = genreOptions[i];
            if (option.selected) genres.push(option.value);
        }

        let themes = [];
        const gameThemesSelect = document.getElementById('gameThemesSelect');
        const themeOptions = gameThemesSelect.options;
        for (let i = 0; i < themeOptions.length; i++) {
            const option = themeOptions[i];
            if (option.selected) themes.push(option.value);
        }
    
        if (!gameName) {
            $('#gameMessage').text('Название игры не может быть пустым');
            return;
        }
        if (!description) {
            $('#gameMessage').text('Описание игры не может быть пустым');
            return;
        }

        const imageCatInput = $('#imageCatInput')[0];
        const imageCat = imageCatInput.files[0];

        const imagePageInput = $('#imagePageInput')[0];
        const imagePage = imagePageInput.files[0];

        const imageLibInput = $('#imageLibInput')[0];
        const imageLib = imageLibInput.files[0];    

        
        if (!imageCat) {
            $('#gameMessage').text('Картинка каталога не может быть пуста');
            return;
        }
        if (!imagePage) {
            $('#gameMessage').text('Картинка страницы игры не может быть пуста');
            return;
        }
        if (!imageLib) {
            $('#gameMessage').text('Картинка библиотеки не может быть пуста');
            return;
        }

        let game = {
            gameName: gameName,
            description: description,
            genres: genres,
            themes: themes
        }
        if (releaseDate) game.releaseDate = releaseDate;
        if (developer) game.developer = developer;
        await addGame(game);
        await uploadImage(imageCat, gameName, 'Cat');
        await uploadImage(imagePage, gameName, 'Page');
        await uploadImage(imageLib, gameName, 'Lib');
        await getGames();
    });
    dialog.showModal();
}

const uploadImage = async (image, gameName, type, action) => {
    const formData = new FormData();
    formData.append('uploadedFile', image); 
    formData.append('type', type); 
    formData.append('gameName', gameName);
    formData.append('action', action);

    await $.ajax({
        url: '/upload',
        method: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        error: function(error) {
            $('#gameMessage').text(error.responseJSON.message);
            return;
        }
    })
}

function openDialog(event) {
    dialog.showModal();
}

function closeDialog(event) {
    if (!event.target.contains(dialog)) return;
    clearDialog();
    dialog.close();
}

function clearDialog() {
    $('#addGameDialogBtn').addClass('d-none');
    $('#addGameDialogBtn').removeClass('d-inline-block');
    $('#addGameDialogBtn').text('');
    $('#gameName').val('');
    $('#gameDescription').val('');
    $('#gameReleaseDate').val('');
    $('#gameDeveloper').val('');
    $('#imageCatFile').attr('src', ``);
    $('#imageCatFile').parent().removeClass('d-inline');
    $('#imageCatFile').parent().addClass('d-none');
    $('#imageLibFile').attr('src', ``);
    $('#imageLibFile').parent().removeClass('d-inline');
    $('#imageLibFile').parent().addClass('d-none');
    $('#imagePageFile').attr('src', ``);
    $('#imagePageFile').parent().removeClass('d-inline');
    $('#imagePageFile').parent().addClass('d-none');
    $('#imageCatInput').val('');
    $('#imageLibInput').val('');
    $('#imagePageInput').val('');
    
    const gameGenresSelect = document.getElementById('gameGenresSelect');
    const genreOptions = gameGenresSelect.options;
    for (let i = 0; i < genreOptions.length; i++) {
        const option = genreOptions[i];
        option.selected = false;
    }
    const gameThemesSelect = document.getElementById('gameThemesSelect');
    const themeOptions = gameThemesSelect.options;
    for (let i = 0; i < themeOptions.length; i++) {
        const option = themeOptions[i];
        option.selected = false;
    }
}

document.addEventListener('click', closeDialog);

const getGames = async (page = 1, append = false) => {
    const search = $('#searchInput').val();

    const response = await $.get(`/games?gameName=${search}&page=${page}`);

    $('#gamesMessage').text('');
    const gamesTable = document.getElementById('gamesTable');
    if (!append) {
        isEmpty = true;
        gamesCount = 0;
        let child = gamesTable.firstChild;
        while (child) {
            const nextSibling = child.nextSibling; 
            if (child.tagName !== 'TEMPLATE') gamesTable.removeChild(child); 
            child = nextSibling; 
        }
    }
    if (isEmpty && response.message) {
        const noGamesCardTemplate = document.getElementById('noGamesCardTemplate');
        const noGamesCard = noGamesCardTemplate.content.cloneNode(true);
        noGamesCard.querySelector('#gamesMessage').querySelector('td').textContent = response.message;
        gamesTable.appendChild(noGamesCard);
        return;
    }
    else if (!response.hasOwnProperty('message')) {
        const gameCardTemplate = document.getElementById('gameCardTemplate');
        response.forEach(game => {
            gamesCount++;
            const gameCard = gameCardTemplate.content.cloneNode(true);
            gameCard.querySelector('#id').textContent = gamesCount;

            gameCard.querySelector('#imageCat').innerHTML = `
                <img src="../assets/gameImg/${game.imageCat}" width="120px" height="45px" alt="">
            `;
            gameCard.querySelector('#gameName').textContent = game.gameName;
            gameCard.querySelector('#genres').textContent = game.genres;
            gameCard.querySelector('#themes').textContent = game.themes;
            gameCard.querySelector('#releaseDate').textContent = game.releaseDate;
            gameCard.querySelector('#developer').textContent = game.developer;
            gameCard.querySelector('#actions').innerHTML = `
                <img id="infoGameBtn" src="../assets/img/info.png" class="open-img cursor-pointer" width="20px" height="20px" alt="">
                <img id="updateGameBtn" src="../assets/img/update.png" class="update-img cursor-pointer" width="20px" height="20px" alt="">
                <img id="deleteGameBtn" src="../assets/img/delete.png" class="delete-img cursor-pointer" width="20px" height="20px" alt="">
            `;
            gameCard.querySelector('#infoGameBtn').addEventListener('click', function() {
                dialog.showModal();
                $('#gameName').val(`${game.gameName}`);
                $('#gameDescription').val(`${game.description}`);
                $('#gameReleaseDate').val(`${game.releaseDate}`);
                $('#gameDeveloper').val(`${game.developer}`);
                $('#imageCatFile').parent().removeClass('d-none');
                $('#imageCatFile').parent().addClass('d-inline');
                $('#imageLibFile').parent().removeClass('d-none');
                $('#imageLibFile').parent().addClass('d-inline');
                $('#imagePageFile').parent().removeClass('d-none');
                $('#imagePageFile').parent().addClass('d-inline');
                $('#imageCatFile').attr('src', `../assets/gameImg/${game.imageCat}`);
                $('#imageLibFile').attr('src', `../assets/gameImg/${game.imageLib}`);
                $('#imagePageFile').attr('src', `../assets/gameImg/${game.imagePage}`)
                const gameGenresSelect = document.getElementById('gameGenresSelect');
                const genreOptions = gameGenresSelect.options;
                for (let i = 0; i < genreOptions.length; i++) {
                    const option = genreOptions[i];
                    if (game.genres.includes(option.value)) option.selected = true;
                }

                const gameThemesSelect = document.getElementById('gameThemesSelect');
                const themeOptions = gameThemesSelect.options;
                for (let i = 0; i < themeOptions.length; i++) {
                    const option = themeOptions[i];
                    if (game.themes.includes(option.value)) option.selected = true;
                }
            });
            gameCard.querySelector('#updateGameBtn').addEventListener('click', function() {
                dialog.showModal();
                $('#gameName').val(`${game.gameName}`);
                $('#gameDescription').val(`${game.description}`);
                $('#gameReleaseDate').val(`${game.releaseDate}`);
                $('#gameDeveloper').val(`${game.developer}`);
                $('#imageCatFile').parent().removeClass('d-none');
                $('#imageCatFile').parent().addClass('d-inline');
                $('#imageLibFile').parent().removeClass('d-none');
                $('#imageLibFile').parent().addClass('d-inline');
                $('#imagePageFile').parent().removeClass('d-none');
                $('#imagePageFile').parent().addClass('d-inline');$('#imageCatFile').attr('src', `../assets/gameImg/${game.imageCat}`);
                $('#imageLibFile').attr('src', `../assets/gameImg/${game.imageLib}`);
                $('#imagePageFile').attr('src', `../assets/gameImg/${game.imagePage}`)
                const gameGenresSelect = document.getElementById('gameGenresSelect');
                const genreOptions = gameGenresSelect.options;
                for (let i = 0; i < genreOptions.length; i++) {
                    const option = genreOptions[i];
                    if (game.genres.includes(option.value)) option.selected = true;
                }

                const gameThemesSelect = document.getElementById('gameThemesSelect');
                const themeOptions = gameThemesSelect.options;
                for (let i = 0; i < themeOptions.length; i++) {
                    const option = themeOptions[i];
                    if (game.themes.includes(option.value)) option.selected = true;
                }
                $('#addGameDialogBtn').removeClass('d-none');
                $('#addGameDialogBtn').addClass('d-inline-block');
                $('#addGameDialogBtn').text('Сохранить');
                $('#gameForm').off('submit');
                $('#gameForm').on('submit', async function(event) {
                    event.preventDefault();
                    let newGameInfo = {};
                    if ($('#gameName').val() !== "" && $('#gameName').val() !== game.gameName) newGameInfo.gameName = $('#gameName').val();
                    if ($('#gameDescription').val() !== "" && $('#gameDescription').val() !== game.description) newGameInfo.description = $('#gameDescription').val();
                    if ($('#gameReleaseDate').val() !== "" && $('#gameReleaseDate').val() !== game.releaseDate) newGameInfo.releaseDate = $('#gameReleaseDate').val();
                    if ($('#gameDeveloper').val() !== "" && $('#gameDeveloper').val() !== game.developer) newGameInfo.developer = $('#gameDeveloper').val();
                    let genres = [];
                    const gameGenresSelect = document.getElementById('gameGenresSelect');
                    const genreOptions = gameGenresSelect.options;
                    for (let i = 0; i < genreOptions.length; i++) {
                        const option = genreOptions[i];
                        if (option.selected) genres.push(option.value);
                    }
                    let themes = [];
                    const gameThemesSelect = document.getElementById('gameThemesSelect');
                    const themeOptions = gameThemesSelect.options;
                    for (let i = 0; i < themeOptions.length; i++) {
                        const option = themeOptions[i];
                        if (option.selected) themes.push(option.value);
                    }
                    if (genres.length !== 0) newGameInfo.genres = genres;
                    if (themes.length !== 0) newGameInfo.themes = themes;

                    const imageCatInput = $('#imageCatInput')[0];
                    const imageCat = imageCatInput.files[0];

                    const imagePageInput = $('#imagePageInput')[0];
                    const imagePage = imagePageInput.files[0];

                    const imageLibInput = $('#imageLibInput')[0];
                    const imageLib = imageLibInput.files[0];    

                    
                    if (imageCat) {
                        await uploadImage(imageCat, game.gameName, 'Cat');
                    }
                    if (imagePage) {
                        await uploadImage(imagePage, game.gameName, 'Page');
                    }
                    if (imageLib) {
                        await uploadImage(imageLib, game.gameName, 'Lib');
                    }
                    
                    updateGame(newGameInfo, game);
                });
            });
            gameCard.querySelector('#deleteGameBtn').addEventListener('click', function() {
                deleteGame(game);
            });
            gamesTable.appendChild(gameCard);
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

const getGame = async (game) => {
    await $.ajax({
        url: `/games/${game.gameName}`,
        method: 'GET',
        contentType: 'application/json',
        error: function(error) {
            console.log(error);
            return;
        }
    });
}

const addGame = async (game) => {
    await $.ajax({
        url: '/games',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(game),
        error: function(error) {
            $('#gameMessage').text(error.responseJSON.message);
            return;
        }
    });
    clearDialog();
    dialog.close();
}

const updateGame = async (newGameInfo, game) => {
    await $.ajax({
        url: `/games/${game.gameName}`,
        method: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(newGameInfo),
        error: function(error) {
            $('#gameMessage').text(error.responseJSON.message);
            return;
        }
    });
    clearDialog();
    dialog.close();
    await getGames();
}

const deleteGame = async (game) => {
    await $.ajax({
        url: `/games/${game.gameName}`,
        method: 'DELETE',
        contentType: 'application/json',
        error: function(error) {
            console.log(error);
            return;
        }
    });
    $('#searchInput').val("");
    await getGames();
}

$(window).on('scroll', handleScroll);

$('#searchInput').on('input', function() {
    currentPage = 1;
});