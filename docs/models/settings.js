export default function settings() {
    return `<div class="vertical">
    <h3>Settings</h3>

    <select>
    <option>Framework</option>
    <option>Extensions</option>
    <option>Builders</option>
    </select>


    <select>
    <option>Version 4</option>
    <option>Version 3</option>
    <option>Version 2</option>
    <option>Version 1</option>
    </select>
    
    ${toTogglable('Show TypeScript')}
    ${toTogglable('Show Deprecations')}
    <div>`;
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
