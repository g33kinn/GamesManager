let managersCount = 0;

$(document).ready(async function() {
    await import('../scripts/navbarAdmin.js');
    await getManagers();
});

const dialog = document.getElementById('userDialog');

function openAddManagerDialog(event) {
    $('#addUserDialogBtn').text('Добавить');
    $('#userForm').off('submit');
    $('#userForm').on('submit', async function(event) {
        event.preventDefault();
        const userName = $('#userName').val();;
        const pass = $('#pass').val();
        const email = $('#email').val();
        const phoneNumber = $('#phoneNumber').val();
        const usersRolesSelect = document.getElementById('usersRolesSelect');
        let role = '';
        const roleOptions = usersRolesSelect.options;
        for (let i = 0; i < roleOptions.length; i++) {
            const option = roleOptions[i];
            if (i === 0 && option.selected) 
                role = 'CMANAGER';
            if (i === 1 && option.selected) 
                role = 'RMANAGER';
        }

        if (!userName) {
            $('#userMessage').text('Логин не может быть пустым');
            return;
        }
        if (!pass) {
            $('#userMessage').text('Пароль не может быть пустым');
            return;
        }
        if (!email) {
            $('#userMessage').text('Почта не может быть пустой');
            return;
        }
        if (!phoneNumber) {
            $('#userMessage').text('Телефон не может быть пустой');
            return;
        }
        if (!role) {
            $('#userMessage').text('Роль не может быть пустой');
            return;
        }

        const manager = {
            userName: userName,
            pass: pass,
            email: email,
            phoneNumber: phoneNumber,
            role: role
        };
        addManager(manager);
    });
    dialog.showModal();
}

function closeDialog(event) {
    if (!event.target.contains(dialog)) return;
    clearDialog();
    dialog.close();
}

function clearDialog() {
    $('#userName').val('');
    $('#pass').val('');
    $('#email').val('');
    $('#phoneNumber').val('');
    $('#userMessage').text('');
    const rolesSelect = document.getElementById('usersRolesSelect');
    const roleOptions = rolesSelect.options;
    for (let i = 0; i < roleOptions.length; i++) {
        const option = roleOptions[i];
        option.selected = false;
    }
}

document.addEventListener('click', closeDialog);

const getManagers = async () => {
    const response = await $.get(`/managers`);

    $('#usersMessage').text('');
    const userTable = document.getElementById('usersTable');

    managersCount = 0;
    let child = userTable.firstElementChild;
    while (child) {
        const nextSibling = child.nextSibling; 
        if (child.tagName !== 'TEMPLATE') userTable.removeChild(child); 
        child = nextSibling; 
    }
    if (response.message) {
        const noUsersCardTemplate = document.getElementById('noUsersCardTemplate');
        const noUsersCard = noUsersCardTemplate.content.cloneNode(true);
        noUsersCard.querySelector('#usersMessage').querySelector('td').textContent = response.message;
        userTable.appendChild(noUsersCard);
        return;
    }
    else if (!response.hasOwnProperty('message')) {
        const userCardTemplate = document.getElementById('userCardTemplate');
        response.forEach(manager => {
            managersCount++;
            const userCard = userCardTemplate.content.cloneNode(true);
            userCard.querySelector('#id').textContent = managersCount;
            userCard.querySelector('#userName').textContent = manager.userName;
            userCard.querySelector('#email').textContent = manager.email;
            userCard.querySelector('#phoneNumber').textContent = manager.phoneNumber;
            userCard.querySelector('#roles').textContent = manager.roles;
            userCard.querySelector('#actions').innerHTML = `
                <img id="updateGameBtn" src="../assets/img/update.png" class="update-img cursor-pointer" width="20px" height="20px" alt="">
                <img id="deleteGameBtn" src="../assets/img/delete.png" class="delete-img cursor-pointer" width="20px" height="20px" alt="">
            `;
            userCard.querySelector('#updateGameBtn').addEventListener('click', function() {
                console.log('update');
                $('#addUserDialogBtn').text('Изменить');
               
                $('#userName').val(manager.userName);
                $('#email').val(manager.email);
                $('#phoneNumber').val(manager.phoneNumber);
                const rolesSelect = document.getElementById('usersRolesSelect');
                const roleOptions = rolesSelect.options;
                for (let i = 0; i < roleOptions.length; i++) {
                    const option = roleOptions[i];
                    console.log(manager.roles)
                    if (i === 0 && manager.roles.includes('CMANAGER')) 
                        option.selected = true;
                    if (i === 1 && manager.roles.includes('RMANAGER')) 
                        option.selected = true;
                }
                $('#userForm').off('submit');
                $('#userForm').on('submit', async function(event) {
                    event.preventDefault();
                    const userName = $('#userName').val();
                    const pass = $('#pass').val();
                    const email = $('#email').val();
                    const phoneNumber = $('#phoneNumber').val();
                    const usersRolesSelect = document.getElementById('usersRolesSelect');
                    let role = '';
                    const roleOptions = usersRolesSelect.options;
                    for (let i = 0; i < roleOptions.length; i++) {
                        const option = roleOptions[i];
                        if (i === 0 && option.selected) 
                            role = 'CMANAGER';
                        if (i === 1 && option.selected) 
                            role = 'RMANAGER';
                    }
                    let newManagerInfo = {};
                    if (userName && userName !== manager.userName) {
                        newManagerInfo.userName = userName;
                    }
                    if (pass) {
                        newManagerInfo.pass = pass;
                    }
                    if (email && email !== manager.email) {
                        newManagerInfo.email = email;
                    }
                    if (phoneNumber && phoneNumber !== manager.phoneNumber) {
                        newManagerInfo.phoneNumber = phoneNumber;
                    }
                    if (role && !manager.roles.includes(role)) {
                        newManagerInfo.role = role;
                    }
                    updateManager(newManagerInfo, manager.userName);
                });
                dialog.showModal();
            });
            userCard.querySelector('#deleteGameBtn').addEventListener('click', function() {
                deleteManager(manager.userName);
            });
            userTable.appendChild(userCard);
        });
    }
}

const addManager = async (manager) => {
    await $.ajax({
        url: '/managers',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(manager),
        error: function(error) {
            $('#userMessage').text(error.responseJSON.message);
            return;
        }
    });
    clearDialog();
    dialog.close();
    getManagers();
}

const deleteManager = async (userName) => {
    await $.ajax({
        url: `/managers/${userName}`,
        method: 'DELETE',
        contentType: 'application/json',
        error: function(error) {
            console.log(error);
            return;
        }
    });
    clearDialog();
    await getManagers();
}

const updateManager = async (newManagerInfo, userName) => {
    await $.ajax({
        url: `/managers/${userName}`,
        method: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(newManagerInfo),
        error: function(error) {
            $('#userMessage').text(error.responseJSON.message);
            return;
        }
    });
    clearDialog();
    dialog.close();
    await getManagers();
}