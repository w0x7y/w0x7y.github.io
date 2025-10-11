function biographyjump() {
    document.getElementById("biography").scrollIntoView({ behavior: "smooth" });
}

const colorThemes = document.querySelectorAll('[name="theme"]');

//store theme
const storedTheme = function (theme) {
    localStorage.setItem('theme', theme);
}

//retrieve theme
const retieveTheme = function () {
    const activeTheme = localStorage.getItem('theme');
    colorThemes.forEach((themeOption) => {
        if (themeOption.id === activeTheme) {
            themeOption.checked = true
        }
    })
}

colorThemes.forEach(themeOption => {
    themeOption.addEventListener('click', () => {
        storedTheme(themeOption.id);
    })
})

document.onload = retieveTheme();

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () => {
        loader.remove();
    })
})

function openPopup() {
    document.getElementById('myPopup').style.display = 'flex';
}
function closePopup() {
    document.getElementById('myPopup').style.display = 'none';
}

function accPopup() {
    if (document.getElementById('Name').value == '') {
        alert('Please enter your name');
             return;
    }
    else if (document.getElementById('food').value == '') {
        alert('Please enter your fevorite food');
        return;
    }
    else {
        var name = document.getElementById('Name').value;

        const logInButton = document.getElementById('LogIn');
        const username = name; // Replace 'YourVariable' with your variable

        logInButton.textContent = username;
        document.getElementById('myPopup').style.display = 'none';
    }
}

function informationjump() {
    document.getElementById("information").scrollIntoView({ behavior: "smooth" });
}

const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
});