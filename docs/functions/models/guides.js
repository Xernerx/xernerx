import versions from "../tools/versions.js";
import formatCode from "./formatCode.js";

export default async function loadGuide() {
    if (!document.URL.includes('guide')) return;

    const version = document.URL.match(/v\d{1}/)[0];
    const build = (await import(`../../guide/${version}.js`)).default;
    const doc = (await import(`../../documentation/${version}.js`)).default;

    const sidebar = document.getElementById('sidebar')

    const classes = document.createElement('div');

    const page = document.getElementById('page');

    page.innerHTML = `<center><img id="welcome" src="../../styles/banner.png" class="banner"><h1 >Welcome to the guide for xernerx ${versions[version]} [WIP]</h1></center>`;

    page.innerHTML += `<div class="component"><h1>Info</h1><div class="code">${formatCode(`npm install xernerx@${doc.info?.versions[0]}`)}</div><br><p>${doc.info?.description}</p><br><p>State: ${doc.info?.deprecated ? "deprecated" : "stable"}</p></div>`

    Object.entries(build).map(([name, value]) => {
        classes.innerHTML += `<h2>${name}</h2>`;

        page.innerHTML += `<h2>${name}<h2>`;

        Object.entries(value).map(([k, v], i) => {
            classes.innerHTML += `<a href="#${k}" class="button-link"><button class="button-link">${k}</button></a>`;

            const component = document.createElement('div');

            component.classList.add('component');

            component.innerHTML += `<h2 id="${k}">${k}<h2>`;

            component.innerHTML += `<p class="description">${v.description}</p>`;

            if (v.steps?.length > 0) {
                v.steps.map((step, i) => {
                    component.innerHTML += `<h3>Step ${i + 1}</h3><p class="description">${step.open}</p>`;

                    if (step.code) component.innerHTML += `<pre class="code">${step.code}</pre>`;

                    if (step.close) component.innerHTML += `<p class="description">${step.close}</p>`;

                    if (step.note) component.innerHTML += `<p class="note">? Note: ${step.note}</p>`

                    if (step.alert) component.innerHTML += `<p class="alert">! alert: ${step.alert}</p>`
                })
            }

            page.appendChild(component)
        })
    })

    sidebar.appendChild(classes);
}