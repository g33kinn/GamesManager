$(document).ready(async function() {
    await import('../scripts/navbarReviewManager.js');
    await getReviews();
});

const getReviews = async () => {
    const response = await $.get('/reviews');

    const reviews = document.getElementById('reviews');
        let child = reviews.firstChild;
        while (child) {
            const nextSibling = child.nextSibling; 
            if (child.tagName !== 'TEMPLATE') reviews.removeChild(child); 
            child = nextSibling; 
        }
    const reviewCardTemplate = document.getElementById('reviewCardTemplate');

    response.forEach(review => {
        const reviewCard = reviewCardTemplate.content.cloneNode(true);

        reviewCard.querySelector('#reviewTitle').textContent = review.isPositive === true ? 'Рекомендую' : 'Не рекомендую';
        reviewCard.querySelector('#reviewImg').src = review.isPositive === true ? '../assets/img/posReview.png' : '../assets/img/negReview.png';
        reviewCard.querySelector('#reviewPublicationDate').textContent = review.publicationDate.split('T')[0];
        reviewCard.querySelector('#reviewGame').textContent = 'Игра: ' + review.game.gameName;
        reviewCard.querySelector('#reviewerNickname').textContent = review.user.userName + ":";
        reviewCard.querySelector('#reviewText').textContent = review.text;
        if (review.editDate) {
            reviewCard.querySelector('#reviewEdit').textContent = 'Изменено:';
            reviewCard.querySelector('#reviewEditDate').textContent = review.editDate.split('T')[0];
        }
        reviewCard.querySelector('#update-delete-review').innerHTML = `
        <img id="deleteReviewBtn" src="../assets/img/delete.png" class="update-delete-img cursor-pointer" width="20px" height="20px" alt="">
        `;
        reviewCard.querySelector('#deleteReviewBtn').addEventListener('click', function() {
            deleteReview(review);
        });
        reviews.appendChild(reviewCard);
    });
    
}

const deleteReview = async (review) => {
    await $.ajax({
        url: `/reviews/${review.game.gameName}/${review._id}`,
        method: 'DELETE',
        contentType: 'application/json',
        error: function(error) {
            console.log(error);
            return;
        }
    });
    await getReviews();
}
