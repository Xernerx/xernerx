export default function settings() {
    return `
    <h3>Settings</h3>

    <select><option>Version 4</option></select>

    ${toTogglable('Show TypeScript')}
    ${toTogglable('Show Deprecations')}
    `;
}

function toTogglable(string) {
    return `<p>
        <label class="switch">
            <input type="checkbox" onChange="${toggle()}">
            <span class="slider round"></span>
        </label>
        ${string}
    </p>
    `;
}

function toggle(event) {}
