/** @format */

document.addEventListener('DOMContentLoaded', async function () {
	// Your JavaScript code here

	const versions = {
		'version 4': await import('../versions/v4.js'),
		'version 3': await import('../versions/v3.js'),
		'version 2': await import('../versions/v2.js'),
		'version 1': await import('../versions/v1.js'),
	};

	const dropdown = document.getElementById('dropdown');
	const infoContainer = document.getElementById('info-container');
	const linkContainer = document.getElementById('link-container');

	for (const version of Object.keys(versions)) {
		dropdown.innerHTML += `<option value="${version}">${version}</option>`;
	}

	const optionData = {};

	Object.entries(versions).map(([k, v], i = 0) => {
		const data = v.default;

		let message = '';

		optionData[k] = {};

		optionData[k].data = data;

		if (Number(k.split(/ +/)[1]) < Object.keys(versions).length) message = `Disclaimer: ${k} has been dropped and will remain unmaintained, consider upgrading to the next version.`;

		optionData[
			k
		].content = `<div class="component" id="welcome"><h3>Xernerx ${k}</h3><p>You're viewing the documentation of ${k}.</p><h5 class="warn">Disclaimer: only things that xernerx adds on top of the Discord.js library are displayed, in case you want to get to know what else you can do check out the official Discord.js documentation!</h5><h5 class="warn">${message}</h5></div>

            ${Object.entries(data)
							.map(
								([wrapper, types]) =>
									`<h1 id="${wrapper}">${wrapper}</h1>
                                 
                                ${types
																	.map((type) => {
																		let string = ``;

																		if (type.name) string += `<h3>${type.name}</h3>`;

																		if (type.description) string += `<p>${type.description}</p>`;

																		if (type.options?.length > 0) {
																			const types = [];

																			type.options.map((option) => Object.keys(option).map((key) => (!types.includes(key) ? types.push(key) : null)));

																			string += `<div class="table"><table>
                                                                            <tr>${types.map((type) => `<th>${type}</th>`).join('')}</tr>
                                                                        ${type.options
																																					.map(
																																						(option) =>
																																							`<tr>${Object.values(option)
																																								.map((option) => `<td>${option}</td>`)
																																								.join('')} </tr>`
																																					)
																																					.join('')}
                                                                        </table></div>`;
																		}

																		let pme = `<div class="horizontal">`;

																		if (type.properties?.length > 0) pme += `<div class="vertical pme"><h4>Properties</h4>${type.properties.map((prop) => `<li>${prop.name}</li>`).join('')}</div>`;

																		if (type.methods?.length > 0) pme += `<div class="vertical pme"><h4>Methods</h4>${type.methods.map((prop) => `<li>${prop.name}</li>`).join('')}</div>`;

																		if (type.events?.length > 0) pme += `<div class="vertical pme"><h4>Events</h4>${type.events.map((prop) => `<li>${prop.name}</li>`).join('')}</div>`;

																		pme += '</div>';

																		string += pme;

																		if (type.example) string += `<p>Example code:</p><pre><code class="language-javascript">${type.example}</code></pre>`;

																		return `<div class="component" id="${type.name}">${string}</div>`;
																	})
																	.join('')}`
							)
							.join('')}
        `;

		const classes = Object.entries(optionData[k].data).map(([wrapper, values]) => ({ wrapper, types: Object.values(values).map((t) => t.name) }));

		optionData[k].sidebar = ``;

		for (const { wrapper, types } of classes) {
			optionData[k].sidebar += `<h2><a class="link" href="#${wrapper}"><button class="button">${wrapper}</button></a></h2>

		    ${types.map((type) => `<h4><a class="link" href="#${type}"><button class="button">${type}</button></a></h4>`).join('')}`;
		}
	});

	// Load saved option on page load
	const savedOption = getVersion() || localStorage.getItem('selectedOption') || 'version 4';
	if (savedOption) {
		dropdown.value = savedOption;
		setPage(savedOption);
	}

	// Handle dropdown change
	dropdown.addEventListener('change', function () {
		const selectedOption = dropdown.value;
		localStorage.setItem('selectedOption', selectedOption);
		setPage(selectedOption);
	});

	function setPage(version) {
		infoContainer.innerHTML = optionData[version].content;

		linkContainer.innerHTML = optionData[version].sidebar;
	}

	function getVersion() {
		document.URL.replace(`v`, 'version ');

		if (Object.keys(optionData).includes(document.URL.split('#')[1]?.replace(`v`, 'version '))) return document.URL.split('#')[1]?.replace(`v`, 'version ');
	}

	Prism.highlightAll();
});
