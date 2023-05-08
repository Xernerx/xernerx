import settings from './settings.js';

function getVersion() {
    const version = document.URL.split(/#/).at(1);

    return { code: version, name: version.replace(/v/gi, 'Version ') };
}

function setTitle() {
    document.title = `Xernerx - ${getVersion().name}`;
}

async function getContent() {
    const content = document.getElementById(getVersion().code);

    if (!content) return;

    content.classList.remove('invisible');
    content.classList.add('visible');

    const aside = content.children.item(0).children.item(0);

    aside.children.item(0).innerHTML += settings();
}

setTitle();

getContent();
