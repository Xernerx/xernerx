import extensions from "../../data/extensions.js";

export default function loadExtensions(type) {
    if (type !== "Extensions") return;

    const page = document.getElementById('page');

    const classes = document.getElementById("classes");

    classes.innerHTML += "<h1>Extensions</h1>"

    page.innerHTML = `<center><img id="welcome" src="../../styles/banner.png" class="banner"><h1 >Welcome to the extension page for xernerx!</h1></center>`;

    page.innerHTML +=
        `<div class="component">
        <h2 id="implementation">Implementation</h2>
    <p class="description">Extensions are very easy to implement, the codeblock below is a simple showcase of one of the extensions.</p>
    <div class="alert">Extensions are limited to V3, check the description of each extension to see what versions it's supported!</div>
    <pre class="code">
    import XernerxCommands from 'xernerx-commands';
    import XernerxClient from 'xernerx';

    new class Client extends XernerxClient {
        constructor() {
            super(discordOptions, clientOptions, config)

            this.register('token')

            this.loadExtensions({extensions:[XernerxCommands], logging:true})
        }
    }
    </pre></div>`

    Object.entries(extensions).map(([name, value]) => {
        classes.innerHTML += `<a href="#${name}" class="button-link"><button class="button-link">${name}</button></a>`

        const component = document.createElement('div');

        component.classList.add('component')

        component.innerHTML += `<h2 id="${name}">${name}</h2><p class="description">${value.description}</p><pre class="code">${value.install}</pre><h4>Versions</h4>${value.support.map(version => `<li>${version}</li>`)}`

        page.appendChild(component)
    })
}