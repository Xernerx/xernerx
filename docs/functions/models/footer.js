export default function createFooter() {
    const content = document.getElementsByClassName('content')[0];

    const footer = document.createElement('footer')

    footer.classList.add('footer')

    footer.innerHTML = `Xernerx<br><br>A class based framework on the Discord.js library`

    // content.appendChild(footer)
}