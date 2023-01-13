export default function loadGuide(type) {
    if (type !== "Guide") return;

    const page = document.getElementById('page');
    const sidebar = document.getElementById('sidebar')

    for (const component of page.getElementsByClassName('component')) {
        for (const div of sidebar.getElementsByTagName('div')) {
            if (div.id === component.id.split('#')[0]?.toLowerCase()) div.innerHTML += `<a href="#${component.id}" class="button-link"><button class="button-link">${component.id.split('#')[1]}</button></a>`
        }
    }
}