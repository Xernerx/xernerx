/** @format */

import settings from './settings.js';

function getVersion() {
	const version = document.URL.split(/#/).at(1);

	return { code: version, name: version?.replace(/v/gi, 'Version ') };
}

function setTitle() {
	document.title = `Xernerx - ${getVersion().name}`;
}

async function getContent() {
	const content = document.getElementById(getVersion().code);

	if (!content) return;

	content.classList.remove('invisible');
	content.classList.add('visible');

	const aside = content.children.item(0).children.item(0),
		main = content.children.item(0).children.item(1);

	const data = await import(`../versions/${getVersion().code}.js`);

	aside.children.item(0).innerHTML = settings();

	for (const [category, items] of Object.entries(data.default)) {
		aside.innerHTML += `<h3>${category}</h3>`;
		items.map((item) => {
			aside.innerHTML += `<a class="link" href="#${item.name}">
                    <button class="button">${item.name}</button>
                </a>`;

			main.innerHTML += `<div class="component" id="${item.name}">
                    <h3>${item.name}</h3>
                </div>`;
		});
	}
}

setTitle();

getContent();
