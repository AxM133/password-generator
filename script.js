document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.querySelectorAll('.checkbox__1 input').forEach(checkbox => {
    checkbox.addEventListener('change', validateForm);
});
document.getElementById('length').addEventListener('input', validateForm);
document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
document.getElementById('infoBtn').addEventListener('click', openModal);
document.querySelector('.modal .close').addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);
window.addEventListener('load', loadHistory);

function validateForm() {
    const lengthInput = document.getElementById('length');
    const length = lengthInput.value;
    const isAnyCheckboxChecked = Array.from(document.querySelectorAll('.checkbox__1 input')).some(checkbox => checkbox.checked);

    const isValidLength = length >= 1 && length <= 100 && !isNaN(length);
    const isValidForm = isValidLength && isAnyCheckboxChecked;

    document.getElementById('generateBtn').disabled = !isValidForm;

    if (!isValidLength) {
        lengthInput.setCustomValidity('Длина пароля должна быть числом между 1 и 100.');
    } else {
        lengthInput.setCustomValidity('');
    }

    const errorContainer = document.getElementById('errorContainer');
    if (!isAnyCheckboxChecked) {
        if (!errorContainer) {
            const errorElement = document.createElement('div');
            errorElement.id = 'errorContainer';
            errorElement.style.color = '#8583f3';
            errorElement.style.marginBottom = '10px';
            errorElement.textContent = 'Выберите хотя бы один тип символов.';
            document.querySelector('.settings').appendChild(errorElement);
        }
    } else {
        if (errorContainer) {
            errorContainer.remove();
        }
    }
}

function generatePassword() {
    if (document.getElementById('generateBtn').disabled) {
        return;
    }
    
    const length = parseInt(document.getElementById('length').value);
    const includeNumbers = document.getElementById('numbers').checked;
    const includeUppercaseLat = document.getElementById('uppercaseLat').checked;
    const includeLowercaseLat = document.getElementById('lowercaseLat').checked;
    const includeUppercaseCyr = document.getElementById('uppercaseCyr').checked;
    const includeLowercaseCyr = document.getElementById('lowercaseCyr').checked;
    const includeSpecialChars = document.getElementById('specialChars').checked;
    const includeExtraChars = document.getElementById('extraChars').checked;
    const firstChar = document.getElementById('firstChar').value;

    const numbers = '0123456789';
    const uppercaseLat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLat = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseCyr = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const lowercaseCyr = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const extraChars = '©®™✓';

    let allChars = '';
    let letterChars = '';
    if (includeNumbers) allChars += numbers;
    if (includeUppercaseLat) {
        allChars += uppercaseLat;
        letterChars += uppercaseLat;
    }
    if (includeLowercaseLat) {
        allChars += lowercaseLat;
        letterChars += lowercaseLat;
    }
    if (includeUppercaseCyr) {
        allChars += uppercaseCyr;
        letterChars += uppercaseCyr;
    }
    if (includeLowercaseCyr) {
        allChars += lowercaseCyr;
        letterChars += lowercaseCyr;
    }
    if (includeSpecialChars) allChars += specialChars;
    if (includeExtraChars) allChars += extraChars;

    let password = '';

    if (firstChar === 'letter' && letterChars.length > 0) {
        password += letterChars[Math.floor(Math.random() * letterChars.length)];
    } else if (firstChar === 'number' && includeNumbers) {
        password += numbers[Math.floor(Math.random() * numbers.length)];
    } else {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    document.getElementById('generatedPassword').value = password;
    addToHistory(password);
}

function copyToClipboard() {
    const passwordField = document.getElementById('generatedPassword');
    passwordField.select();
    document.execCommand('copy');
    alert('Пароль скопирован в буфер обмена!');
}

function addToHistory(password) {
    const history = document.getElementById('passwordHistory');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${password} <span class="material-icons copy-icon" data-password="${password}">content_copy</span>`;
    history.prepend(listItem);
    saveHistory();
    addCopyEvent(listItem.querySelector('.copy-icon'));
}

function addCopyEvent(copyIcon) {
    copyIcon.addEventListener('click', function() {
        const password = this.getAttribute('data-password');
        const textarea = document.createElement('textarea');
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Пароль скопирован в буфер обмена!');
    });
}

function saveHistory() {
    const passwords = Array.from(document.getElementById('passwordHistory').children).map(item => item.textContent.split(' ')[0].trim());
    localStorage.setItem('passwordHistory', JSON.stringify(passwords));
}

function loadHistory() {
    const passwords = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    const history = document.getElementById('passwordHistory');
    passwords.forEach(password => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${password} <span class="material-icons copy-icon" data-password="${password}">content_copy</span>`;
        history.appendChild(listItem);
        addCopyEvent(listItem.querySelector('.copy-icon'));
    });
}

function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю паролей?')) {
        document.getElementById('passwordHistory').innerHTML = '';
        localStorage.removeItem('passwordHistory');
    }
}

function openModal() {
    document.getElementById('infoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function outsideClick(event) {
    if (event.target == document.getElementById('infoModal')) {
        closeModal();
    }
}

window.addEventListener('load', validateForm);



// Получаем элементы
const modal = document.getElementById("infoModal");
const btn = document.getElementById("infoBtn");
const span = document.getElementsByClassName("close")[0];

// Открываем модальное окно при клике на кнопку
btn.onclick = function() {
    modal.style.display = "block";
}

// Закрываем модальное окно при клике на <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Закрываем модальное окно при клике вне его
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}