const isAuthenticated = document.cookie.split('=')[1] === 'true';
const gameName = decodeURIComponent(window.location.pathname.split('/').pop());
let game = {};
let gameInLib = [];
let userReview = {};
let currentPage = 1;
let isLoading = false;
let isEmpty = true;

$(document).ready(async function() {
    await import('../scripts/navbar.js');
    $('#navbar .nav-link:nth-child(1) span').addClass('active');
    game = await $.get(`/games/${gameName}`);
    await getGame(game);
    if (isAuthenticated) gameInLib = await $.get(`/libraryGames/${gameName}`);
    await getReviews(game);

    if (gameInLib.hasOwnProperty('message')) {
        $('.add-game-btn').removeClass('d-none');
        $('.add-game-btn').addClass('d-inline-block');
    }
    else {
        $('.add-game-btn').removeClass('d-inline-block');
        $('.add-game-btn').addClass('d-none');
        $('#message').text('Игра уже есть в библиотеке');
    }

    if(!userReview.hasOwnProperty('message')) {
        $('#reviewForm').off('submit');
        $('#reviewForm').on('submit', function(event) {
            event.preventDefault();
            updateReview(game);
        });
    }
    else {
        $('#reviewForm').off('submit');
        $('#reviewForm').on('submit', function(event) {
            event.preventDefault();
            addReview(game);
        });
    }
   
});

const dialog = document.getElementById('reviewDialog');
const button = document.getElementById('openReviewDialogBtn');

function openDialog(event) {
    dialog.showModal();
}

function closeDialog(event) {
    if (!event.target.contains(dialog)) return;
    dialog.close();
}

document.addEventListener('click', closeDialog);

const getGame = async (game) => {
    document.title = game.gameName;
    $('.game-page-name').text(game.gameName);
    $('#description').text(game.description);
    $('#genres').text(game.genres);
    $('#themes').text(game.themes);
    $('#releaseDate').text(game.releaseDate);
    $('#OS').text(game.minRequirements.OS);
    $('#CPU').text(game.minRequirements.CPU);
    $('#RAM').text(game.minRequirements.RAM);
    $('#GPU').text(game.minRequirements.GPU);
    $('#Storage').text(game.minRequirements.Storage);

    $('.add-game-btn').on('click', function(e) {
        e.preventDefault();
        $('.add-game-btn').removeClass('d-inline-block');
        $('.add-game-btn').addClass('d-none');
        if (userReview.hasOwnProperty('message')) {
            $('#openReviewDialogBtn').removeClass('d-none');
            $('#openReviewDialogBtn').addClass('d-inline-block');
        }
        addGameToLibrary(game);
    });
}

const addGameToLibrary = async (game) => {
    const gameName = game.gameName
    await $.ajax({
        url: `/libraryGames`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ gameName }),
        success: function(result) {
            $('#message').text(result.message);
        },
        error: function(error) {
            $('#message').text(error.responseJSON.message);
        }
    });
    gameInLib = await $.get(`/libraryGames?gameName=${gameName}`)
}

const getReviews = async (game, page = 1, append = false) => {
    const response = await $.get(`/reviews/${game.gameName}?page=${page}`);
    $('#reviewsMessage').text("")

    if (isAuthenticated) userReview = await $.get(`/review/${game.gameName}`);
    if (gameInLib.hasOwnProperty('message')) {
        $('#openReviewDialogBtn').removeClass('d-inline-block');
        $('#openReviewDialogBtn').addClass('d-none');
    }
    else if (userReview.hasOwnProperty('message')) {
        $('#openReviewDialogBtn').removeClass('d-none');
        $('#openReviewDialogBtn').addClass('d-inline-block');
    }

    if(!append) {
        isEmpty = true;
        const reviews = document.getElementById('reviews');
        let child = reviews.firstChild;
        while (child) {
            const nextSibling = child.nextSibling; 
            if (child.tagName !== 'TEMPLATE') reviews.removeChild(child); 
            child = nextSibling; 
        }
    }

    if (isEmpty && response.hasOwnProperty('message')) {
        $('#reviewsMessage').text(response.message);
        return;
    }
    if (response.hasOwnProperty('message'))
        return;

    const reviewCardTemplate = document.getElementById('reviewCardTemplate');
    const otherReviews = [];
    
    response.forEach(review => {
        if (review._id !== userReview._id) {
            otherReviews.push(review);
        }
            
    });
    let sortedReviews = [];
    if (page === 1) 
        sortedReviews = userReview.hasOwnProperty('message') ? otherReviews : [userReview, ...otherReviews];
    else 
        sortedReviews = otherReviews;
    
    sortedReviews.forEach(review => {
        const reviewCard = reviewCardTemplate.content.cloneNode(true);

        reviewCard.querySelector('#reviewTitle').textContent = review.isPositive === true ? 'Рекомендую' : 'Не рекомендую';
        reviewCard.querySelector('#reviewImg').src = review.isPositive === true ? '../assets/img/posReview.png' : '../assets/img/negReview.png';
        reviewCard.querySelector('#reviewPublicationDate').textContent = review.publicationDate.split('T')[0];
        reviewCard.querySelector('#reviewerNickname').textContent = review.userID.userName + ":";
        reviewCard.querySelector('#reviewText').textContent = review.text;
        if (review.editDate) {
            reviewCard.querySelector('#reviewEdit').textContent = 'Изменено:';
            reviewCard.querySelector('#reviewEditDate').textContent = review.editDate.split('T')[0];
        }
        if (review._id === userReview._id) {
            reviewCard.querySelector('#update-delete-review').innerHTML = `
                <img id="updateReviewBtn" src="../assets/img/update.png" class="update-delete-img cursor-pointer" width="20px" height="20px" alt="">
                <img id="deleteReviewBtn" src="../assets/img/delete.png" class="update-delete-img cursor-pointer" width="20px" height="20px" alt="">
            `;
            reviewCard.querySelector('#updateReviewBtn').addEventListener('click', function() {
                dialog.showModal();
                $('#review').val(userReview.text);
                if (userReview.isPositive) $('input[name="reviewType"][value=positive]').prop('checked', true);
                else $('input[name="reviewType"][value=negative]').prop('checked', true);
            });
            reviewCard.querySelector('#deleteReviewBtn').addEventListener('click', function() {
                deleteReview(game);
            });
        }
        reviews.appendChild(reviewCard);
    });

    currentPage = page;
    isEmpty = false;
}

const addReview = async (game) => {
    const text = $('#review').val();
    const positive = $('input[name="reviewType"]:checked').val();
    if (!text) {
        $('#reviewMessage').text('Текст отзыва не может быть пустым');
        return;
    }
    if (!positive) {
        $('#reviewMessage').text('Тип отзыва не может быть пустым');
        return;
    }

    const review = {
        text: text,
        isPositive: positive === 'positive' ? true : false
    }
    await $.ajax({
        url: `/reviews/${game.gameName}`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(review),
        error: function(error) {
            $('#reviewMessage').text(error.responseJSON.message);
            return;
        }
    });
    $('#review').val("");
    $('input[name="reviewType"]').prop('checked', false);
    $('#openReviewDialogBtn').removeClass('d-inline-block');
    $('#openReviewDialogBtn').addClass('d-none');
    await getReviews(game);
    $('#reviewForm').off('submit');
    $('#reviewForm').on('submit', function(e) {
        e.preventDefault();
        updateReview(game);
    })
    dialog.close();
}

const updateReview = async (game) => {
    const text = $('#review').val();
    const positive = $('input[name="reviewType"]:checked').val();
    if (text === userReview.text && positive === userReview.isPositive) {
        $('#reviewMessage').text('Отзыв должен отличаться от предыдущего');
        return;
    }
    let reviewUpdate = {};
    if (text !== userReview.text) reviewUpdate.text = text;
    if (positive !== userReview.isPositive) reviewUpdate.isPositive = positive === 'positive' ? true : false;
    await $.ajax({
        url: `/reviews/${gameName}`,
        method: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(reviewUpdate),
        success: async function() {
            $('#review').val("");
            $('input[name="reviewType"]').prop('checked', false);
            dialog.close();
            await getReviews(game);
        },
        error: function(error) {
            $('#reviewMessage').text(error.responseJSON.message);
            return;
        }
    });
}   

const deleteReview = async (game) => {
    await $.ajax({
        url: `/reviews/${game.gameName}`,
        method: 'DELETE',
        contentType: 'application/json',
        error: function(error) {
            $('#reviewMessage').text(error.responseJSON.message);
            return;
        }
    });
    $('#review').val("");
    $('input[name="reviewType"]').prop('checked', false);
    $('#reviewForm').off('submit');
    $('#reviewForm').on('submit', function(e) {
        e.preventDefault();
        addReview(game);
    })
    await getReviews(game);
}


const handleScroll = () => {
    const distanceToBottom = $(document).height() - $(window).scrollTop() - $(window).height();
    if (distanceToBottom < 100) {
        if (!isLoading) {
            isLoading = true;
            setTimeout(async () => {
                await getReviews(game, currentPage + 1, true);
                isLoading = false;
            }, 1000);
        }
    }

};

$(window).on('scroll', handleScroll);

$('#searchInput').on('input', function() {
    currentPage = 1;
});

