export default function createSidebar(pages) {
    const body = document.getElementsByTagName('body')[0];

    if (!pages) return;

    const container = document.createElement('div');

    container.classList.add('container');

    const aside = document.createElement('aside');
    aside.id = "sidebar";
    aside.classList.add("sidebar");
    aside.innerHTML =
        '<div class="deco">' +
        '<h1>General</h1>' +
        '<a href="#welcome">' +
        '<button class="link">Welcome</button>' +
        '</a>' +
        '</div > ' +
        '<div class="deco" id="classes"></div>'

    const page = document.createElement('main');
    page.id = "page";
    page.classList.add('content');
    page.innerText = "Loading...";

    container.appendChild(aside)
    container.appendChild(page)
    body.appendChild(container);
}