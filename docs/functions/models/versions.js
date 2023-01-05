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

    page.innerHTML = `<center><img id="welcome" src="../../styles/banner.png" class="banner"></img><h1 >Welcome to xernerx ${versions[version]}</h1></center>`;

    for (const [key, value] of Object.entries(build)) {
        const content = document.createElement('div');

        content.innerHTML = `<h4>${key}</h4>`;

        page.innerHTML += `<h1>${key}</h1>`

        for (const [name, info] of Object.entries(value)) {
            const a = document.createElement('a');

            a.innerHTML = `<button class="link">${name}</button>`;

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