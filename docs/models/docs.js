function getVersion() {
    const version = document.URL.split(/#/).at(1);

    return { code: version, name: version.replace(/v/gi, 'Version ') };
}

function setTitle() {
    document.title = `Xernerx - ${getVersion().name}`;
}

function getContent() {
    const content = document.getElementById(getVersion().code);

    if (!content) return;

    content.classList.remove('invisible');
    content.classList.add('visible');
}

setTitle();

getContent();
