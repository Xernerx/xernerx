import versions from "../tools/versions.js";
import formatCode from "./formatCode.js";

export async function loadVersion(type) {
    if (type !== "Documentation") return;

    const version = document.URL.match(/v\d{1}/)[0];
    const build = (await import(`../../documentation/${version}.js`)).default;
    const page = document.getElementById('page');

    const classes = document.getElementById("classes");
    const header = document.createElement('h1')

    header.innerText = "Classes";
    classes.appendChild(header);

    let list = {}, i = 0;

    build.info.versions.map(version => {
        if (list[i]?.length >= 10) i++
        if (!list[i]) list[i] = [];

        list[i].push(version)
    })

    page.innerHTML = `<center><img id="welcome" src="../../styles/banner.png" class="banner"><h1 >Welcome to xernerx ${versions[version]}</h1></center>`;

    page.innerHTML += `<div class="component"><h1>Info</h1><div class="code">${formatCode(`npm install xernerx@${build.info?.versions[0]}`)}</div><br><p>${build.info?.description}</p><br><p>State: ${build.info?.deprecated ? "deprecated" : "stable"}<br><br><p><a href="guide.html" class="link">Guide</a></p></p><br><h4>Versions</h4>${`<div class="container">${Object.values(list).map(value => `<div>${value.map(version => `<li><a href="https://www.npmjs.com/package/xernerx/v/${version}" class="link">${version}</a></li>`).join('')}</div>`).join('')}</div>`}</div>`

    delete build.info

    for (const [key, value] of Object.entries(build)) {
        const content = document.createElement('details');

        content.setAttribute('open', 'open')

        content.innerHTML = `<summary><h4>${key}</h4><summary>`;

        page.innerHTML += `<h1>${key}</h1>`

        for (const [name, info] of Object.entries(value)) {
            const a = document.createElement('a');
            a.innerHTML = `<button class="button-link">${name}</button>`;
            a.href = `#${name}`;
            content.appendChild(a);

            const component = document.createElement('div');

            component.classList.add('component');

            component.innerHTML += `<h2 id="${name}">${name}</h2>`;

            if (info.description) component.innerHTML += `<p class="description">${info.description}</p>`;

            if (info.example) component.innerHTML += `<h3>Constructor</h3><div class="code">${formatCode(info.example)}</div>`;

            if (info.parameters) {
                const table = loadTable(info.parameters)

                component.appendChild(table);
            }

            const container = document.createElement('div');

            container.classList.add('container');
            container.classList.add('dis');

            if (info.properties) {
                const div = document.createElement('div');

                div.innerHTML = `<details open class="details"><summary><h3>Properties</h3></summary>${info.properties.map(x => `<li><a class="silent-link" href="#${name}.${Object.keys(x)[0]}">${Object.keys(x)[0]}</a></li>`).join('')}</details>`;

                container.appendChild(div);
            }

            if (info.methods) {
                const div = document.createElement('div');

                div.innerHTML = `<details open class="details"><summary><h3>Methods</h3></summary>${info.methods.map(x => `<li><a class="silent-link" href="#${name}.${x.name}">${x.name}</a></li>`).join('')}</details>`;

                container.appendChild(div);
            }

            if (info.events) {
                const div = document.createElement('div');

                div.innerHTML = `<details open class="details"><summary><h3>Events</h3></summary>${info.events.map(x => `<li><a class="silent-link" href="#${name}.${x.name}">${x.name}</a></li>`).join('')}</details>`;

                container.appendChild(div);
            }

            component.appendChild(container);

            if (info.properties) {
                const div = document.createElement('div');

                div.innerHTML = `<h3>Properties</h3>${info.properties.map(x => `<h4 id="${name}.${Object.keys(x)}">.${Object.keys(x)}<h4><p class="description">${Object.values(x)}</p>`).join('')}`;

                component.appendChild(div);
            }

            if (info.methods) {
                const div = document.createElement('div');

                div.innerHTML += `<h3>Methods</h3>`;

                info.methods.map(x => {
                    div.innerHTML += `<h4 id="${name}.${x.name}">.${x.name}(${x.parameters.map(p => p.name).join(', ')})</h4><p class="description">${x.description}</p>`;

                    if (x.parameters) {
                        const table = loadTable(x.parameters);

                        div.appendChild(table)
                    }
                })

                component.appendChild(div);
            }

            if (info.events) {
                const div = document.createElement('div');

                div.innerHTML += `<h3>Events</h3>`;

                info.events.map(x => {
                    div.innerHTML += `<h4 id=${name}.${x.name}>${x.name}</h4><p class="description">${x.description}</p>`;

                    if (x.parameters) {
                        const table = loadTable(x.parameters);

                        div.appendChild(table)
                    }
                })

                component.appendChild(div);
            }

            if (info.types) {
                component.innerHTML += info.types.map(type => `<li>${type}</li>`).join('')
            }

            page.appendChild(component)
        }

        classes.appendChild(content);
    }
}

function loadTable(parameters) {
    const table = document.createElement('table')

    table.innerHTML += `<tr><th>Parameter</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>`

    parameters.map(param => {
        table.innerHTML += `<tr><td>${param.name}</td><td>${param.type}</td><td>${param.default}</td><td>${param.required}</td><td>${param.description}</td></tr>`
    })

    return table
}

export function loadChanges(type) {
    if (type !== "Changelog") return;

    const sidebar = document.getElementById('sidebar');
    const page = document.getElementById('page');

    for (const version of page.getElementsByClassName('component')) {
        sidebar.innerHTML += `<a href="#${version.id}" class="button-link"><button class="button-link">${version.id}</button></a>`
    }
}
