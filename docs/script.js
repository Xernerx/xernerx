/** @format */

const messages = document.getElementById('chat__messages');
const channels = document.getElementById('sidebar__channels');

const header = document.getElementById('chatHeader__left');
if (id) header.innerHTML = `<h3 class="title"># ${id}</h3>`;

const title = document.getElementById('title');
title.innerHTML = `Xernerx v${version}`;

(async () => {
	const data = (await import(`./versions/v${version}.js`)).default;

	for (const [category, subcategories] of Object.entries(data).sort()) {
		channels.innerHTML += `<a class="link" href="#${category}"><h3>${category}</h3>`;

		messages.innerHTML += `<div class="message"><h1 id="${category}">${category}</h1></div>`;

		subcategories.sort((a, b) => {
			if (a.name < b.name) return -1;

			if (a.name > b.name) return 1;

			return 0;
		});

		for (const subcategory of subcategories) {
			channels.innerHTML += `<a class="link" href="#${subcategory.name}"><h4># ${subcategory.name}</h4></a>`;

			subcategory.properties?.sort((a, b) => {
				if (a.name < b.name) return -1;

				if (a.name > b.name) return 1;

				return 0;
			});

			subcategory.methods?.sort((a, b) => {
				if (a.name < b.name) return -1;

				if (a.name > b.name) return 1;

				return 0;
			});

			subcategory.events?.sort((a, b) => {
				if (a.name < b.name) return -1;

				if (a.name > b.name) return 1;

				return 0;
			});

			subcategory.options?.sort((a, b) => {
				if (a.name < b.name) return -1;

				if (a.name > b.name) return 1;

				return 0;
			});

			messages.innerHTML += `
            <div class="message">
                <div class="embed">
                    <h2  id="${subcategory.name}">${subcategory.name}</h2>

                    <p>${subcategory.description}</p>

                    <div class="flex">
                        ${subcategory.properties ? `<div class="attach"><h4>Properties</h4>${subcategory.properties.map((prop) => `<li>${prop.name}</li>`).join('')}</div>` : ''}
                        ${subcategory.methods ? `<div class="attach"><h4>Methods</h4>${subcategory.methods.map((prop) => `<li>${prop.name}</li>`).join('')}</div>` : ''}
                        ${subcategory.events ? `<div class="attach"><h4>Events</h4>${subcategory.events.map((prop) => `<li>${prop.name}</li>`).join('')}</div>` : ''}
                    </div>

                    ${
											subcategory.example
												? `<h4>Example code</h4><code class="language-javascript"><pre>${Prism.highlight(subcategory.example, Prism.languages.javascript, 'javascript')}</pre></code>`
												: ''
										}
                </div>
            </div>`;
		}
	}
})();
