export default function createFooter() {
    const body = document.getElementsByTagName('body')[0];

    const footer = document.createElement('footer')

    footer.innerHTML = `Xernerx<br><br>A class based framework on the Discord.js library`;

    body.appendChild(footer)
}