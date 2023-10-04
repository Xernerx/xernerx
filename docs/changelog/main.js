/** @format */

import changelog from './changelog.js';

const sidebar = document.getElementById('sidebar');
const page = document.getElementById('page');

const changes = Object.entries(changelog);

for (const [index, change] of changes) {
	const link = document.createElement('a');

	link.href = `#${change.version}`;

	link.innerHTML = `<button class="button">${change.version}</button>`;

	link.classList.add('link');

	sidebar.appendChild(link);

	const div = document.createElement('div');

	div.innerHTML = `<h3 id="${change.version}">${change.version} - ${change.title}</h3><h4>Changes</h4><p>${change.changes.map((c) => `<li>${changeType(c)}</li>`).join('')}</p>`;

	div.classList.add('component');

	page.appendChild(div);
}

function changeType(str) {
	return str.replace('+', 'Added').replace('-', 'Deleted').replace('~', 'Changed').replace('*', 'Fixed').replace('^', 'Updated');
}

/**
 * + Add
 * - Delete
 * ~ Change
 * * Fix
 * ^ Update
 */
