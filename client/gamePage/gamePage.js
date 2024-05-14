document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#navbar .nav-link:nth-child(1) span').classList.add('active');
    getGamePage();
});

const dialog = document.getElementById('reviewDialog');
const button = document.querySelector('.leave-review-btn');

function openDialog() {
    dialog.showModal();
}

function closeDialog(event) {
    if (!event.target.contains(dialog)) return;
    dialog.close();
}

const getGamePage = async () => {
    const param = decodeURIComponent(window.location.search.substring(1)).split('=');
    const gameRes = await fetch(`http://localhost:3000/catalog/${param[1]}`);
    const game = await gameRes.json();
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2RmOGY1NGZjMmIzNzNmOTI4NTAyZSIsInJvbGVzIjpbIlBMQVlFUiJdLCJpYXQiOjE3MTU3MTc0NjAsImV4cCI6MTcxNTgwMzg2MH0.e7cgiy0pXuq1NUQo5lRDz5KZ6o-AAaAPz-yR_cZ0yr0';
    document.querySelector('.game-page-name').textContent = game.gameName;
    document.getElementById('genres').textContent = game.genres;
    document.getElementById('themes').textContent = game.themes;
    document.getElementById('releaseDate').textContent = game.releaseDate;
    document.getElementById('OS').textContent = game.minRequirements.OS;
    document.getElementById('CPU').textContent = game.minRequirements.CPU;
    document.getElementById('RAM').textContent = game.minRequirements.RAM;
    document.getElementById('GPU').textContent = game.minRequirements.GPU;
    document.getElementById('Storage').textContent = game.minRequirements.Storage;

    document.querySelector('.add-game-btn').addEventListener('click', e => {
        e.preventDefault();
        addGameToLibraryFunc(game.gameName, jwt);
    });
}

const addGameToLibraryFunc = async (gameName, jwt) => {
    const res = await fetch(`http://localhost:3000/library`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
            gameName: gameName
        })
    })

    const result = await res.json();
    alert(result.message);
}

button.addEventListener('click', openDialog);
document.addEventListener('click', closeDialog);