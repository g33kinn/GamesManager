document.addEventListener('DOMContentLoaded', () => document.querySelector('#navbar .nav-link:nth-child(1) span').classList.add('active'));
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