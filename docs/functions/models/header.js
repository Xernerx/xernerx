export default function createHeader(page) {
    const header = document.getElementsByTagName('header')[0];

    header.classList.add('header')

    header.innerHTML =
        '<button id="dark" name="dark">' +
        `<img class="icon" src="${page ? "../../" : ""}styles/darkMode.png" name="dark" dark-mode></img>` +
        '</button>' +
        `<a href="${page ? "../../" : ""}home.html" class="link"><button class="link">Xernerx</button></a>` +
        '<div>' +
        `<a href="${page ? "../../" : ""}pages/v1/welcome.html" class="link"><button class="link">Version 1</button></a>` +
        `<a href="${page ? "../../" : ""}pages/v2/welcome.html" class="link"><button class="link">Version 2</button></a>` +
        `<a href="${page ? "../../" : ""}pages/v3/welcome.html" class="link"><button class="link">Version 3</button></a>` +
        '</div>'
}