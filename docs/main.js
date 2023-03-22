function createHeader() {
    const header = document.getElementsByTagName('header').item(0);

    header.classList.add('header');

    if (document.URL.includes('docs') || document.URL.includes('guides')) var subfolder = true;

    header.innerHTML = `
    <div class="horizontal">
        <a href=".">
            <img class="logo" src="${subfolder ? '../' : ''}icons/Xernerx - Icon - Black.png" />
        </a>
        
        <a class="header-button" href="https://discord.js.org">
            <button class="button">Discord.js</button>
        </a>

        <a class="header-button" href="/docs/v4.html">
            <button class="button">Documentation</button>
        </a>

        <a class="header-button" href="/guides/v4.html">
            <button class="button">Guide</button>
        </a>

        <a class="header-button" href="https://github.com/xernerx/xernerx#readme">
            <button class="button">Github</button>
        </a>
    </div>
        `;
}

createHeader();
