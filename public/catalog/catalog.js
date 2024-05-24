document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#navbar .nav-link:nth-child(1) span').classList.add('active');
    getCatalog();
});
document.getElementById('actionGame').addEventListener('onclick', e => e.preventDefault());
function openFilterList(listID) {
    let content = document.getElementById(listID);
    if (!content.classList.contains('d-none'))
        content.classList.add('d-none');
    else
        content.classList.remove('d-none');
}
function toggleCheckbox(checkboxID) {
    let checkbox = document.getElementById(checkboxID);
    checkbox.checked = !checkbox.checked;
}

const getCatalog = () => {
    fetch('http://localhost:3000/catalog')
        .then(response => response.json())
        .then(games => {
            const catalog = document.getElementById('catalog');
            const gameCardTemplate = document.getElementById('gameCardTemplate');
            games.forEach(game => {
                const gameCard = gameCardTemplate.content.cloneNode(true);
                const article = gameCard.querySelector('.catalog-item');

                gameCard.querySelector('.game-name-span').textContent = game.gameName;

                article.addEventListener('click', function() {
                    window.location.href = `/gamePage/gamePage.html?gameName=${game.gameName}`;
                });
                catalog.appendChild(gameCard);
            });
        })
}