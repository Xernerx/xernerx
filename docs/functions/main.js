import loadExtensions from "./models/extensions.js";
import formatCode from "./models/formatCode.js";
import loadGuide from "./models/guides.js";
import createHeader from "./models/header.js";
import loadLinks from "./models/links.js";
import createSidebar from "./models/sidebar.js";
import { loadVersion, loadChanges } from "./models/versions.js";

console.log(pageType())

/**
 * Create the global header.
 */
createHeader(document.URL.includes('pages'));

/**
 * Create the sidebar.
 */
createSidebar(pageType());

loadGuide(pageType());

loadChanges(pageType());

/**
 * Load page contents based on structures.
 */
loadVersion(pageType());

loadExtensions(pageType());

loadLinks(pageType());

/**
 * A function to get the type of page.
 * @returns the type of page the user is viewing
 */
function pageType() {
    const types = ["Documentation", "Guide", "Extensions", "Changelog", "Sitemap", "Home"], url = document.URL;

    if (url.includes('guide')) return types[1];
    else if (url.includes('extensions')) return types[2];
    else if (url.includes('changelog')) return types[3]
    else if (url.includes('sitemap')) return types[4]
    else if (url.includes('pages')) return types[0];
    else return types[5];
}



const install = document.getElementById('install');

if (install) install.innerHTML = formatCode(install.innerText);

const lightMode = document.querySelector('[dark-mode]');

lightMode.addEventListener('click', async (event) => {
    const body = document.getElementsByTagName('body')[0];

    if (Object.values(body.classList).includes('light')) body.classList.remove('light');

    else body.classList.add('light');

    const silentLinks = document.getElementsByClassName('silent-link')
})
