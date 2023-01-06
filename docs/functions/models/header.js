export default function createHeader(page) {
    const header = document.getElementsByTagName('header')[0];

    header.classList.add('header')

    header.innerHTML =
        '<button id="dark" name="dark">' +
        `<img class="icon" src="${page ? "../../" : ""}styles/darkMode.png" name="dark" dark-mode>` +
        '</button>' +
        '<div>' +
        `<a href="${page ? "../../" : ""}home.html" class="button-link"><button class="button-link">Xernerx</button></a>` +
        `<a href="${page ? "../../" : ""}pages/v1/home.html" class="button-link"><button class="button-link">Version 1</button></a>` +
        `<a href="${page ? "../../" : ""}pages/v2/home.html" class="button-link"><button class="button-link">Version 2</button></a>` +
        `<a href="${page ? "../../" : ""}pages/v3/home.html" class="button-link"><button class="button-link">Version 3</button></a>` +
        `<a href="https://discord.js.org/#/" class="button-link"><button class="button-link">Discord.js</button></a>` +
        '</div>'
}