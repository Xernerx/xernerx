const versions = {
    v1: "version 1",
    v2: "version 2",
    v3: "version 3"
}

export default async function loadVersion() {
    if (!document.URL.includes('pages')) return;

    const version = document.URL.match(/v\d{1}/)[0];
    const build = (await import(`../../versions/${version}.js`)).default;
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

    page.innerHTML += `<div class="component"><h1>Info</h1><div class="code">npm install xernerx@${build.info?.versions[0]}</div><br><p>${build.info?.description}</p><br><p class="">State: ${build.info?.deprecated ? "deprecated" : "stable"}</p><br><h4>Versions</h4>${`<div class="container">${Object.values(list).map(value => `<div>${value.map(version => `<li><a href="https://www.npmjs.com/package/xernerx/v/${version}" class="link">${version}</a></li>`).join('')}</div>`).join('')}</div>`}</div>`

    delete build.info

    for (const [key, value] of Object.entries(build)) {
        const content = document.createElement('div');

        content.innerHTML = `<h4>${key}</h4>`;

        page.innerHTML += `<h1>${key}</h1>`

        for (const [name, info] of Object.entries(value)) {
            const a = document.createElement('a');

            a.innerHTML = `<button class="button-link">${name}</button>`;

            a.href = `#${name}`;

            content.appendChild(a);

            page.innerHTML += `<div id="${name}" class="component">`
                + `<h2>${name}</h2>` +
                `<p class="description">${info.description || "No description."}</p>` +
                (info.properties?.length > 0 ? "<h3>Properties</h3>" + (info.properties.map(prop => `<h4>.${Object.keys(prop)}</h4><p class="description">${Object.values(prop)}</p>`)).join('') : "") +
                (info.methods?.length > 0 ? "<h3>Methods</h3>" + (info.methods.map(method => `<h4>.${method.name}()</h4> <p class="description">${method.description}</p><table><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th>${method.parameters.map(param => `<tr><td>${param.name}</td><td>${param.type}</td><td>${param.default}</td><td>${param.required || false}</td><td>${param.description}</td></tr>`).join('')}</tr ></table >`)).join('') : "") +
                (info.parameters?.length > 0 ? (`<table><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th>${info.parameters.map(param => `<tr><td>${param.name}</td><td>${param.type}</td><td>${param.default}</td><td>${param.required || false}</td><td>${param.description}</td></tr>`).join('')}</tr></table>`) : "") +
                '</div>'
        }

        classes.appendChild(content);
    }
}