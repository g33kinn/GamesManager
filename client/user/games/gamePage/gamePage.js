document.addEventListener('DOMContentLoaded', () => document.querySelector('#navbar .nav-link:nth-child(1) span').classList.add('active'));

const dialog = document.getElementById('reviewDialog');
const button = document.querySelector('button');

function openDialog() {
    dialog.showModal();
}

function closeDialog(event) {
    if (!event.target.contains(dialog)) return;
    dialog.close();
}

button.addEventListener('click', openDialog);
document.addEventListener('click', closeDialog);