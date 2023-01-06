import createFooter from "./models/footer.js";
import formatCode from "./models/formatCode.js";
import createHeader from "./models/header.js";
import createSidebar from "./models/sidebar.js";
import loadVersion from "./models/versions.js";

createHeader(document.URL.includes('pages'));

createSidebar(document.URL.includes('pages'));

loadVersion();

// createFooter();

const install = document.getElementById('install');

if (install) install.innerHTML = formatCode(install.innerText);


const lightMode = document.querySelector('[dark-mode]');

lightMode.addEventListener('click', async (event) => {
    const body = document.getElementsByTagName('body')[0];

    if (Object.values(body.classList).includes('light')) body.classList.remove('light');

    else body.classList.add('light');
})
