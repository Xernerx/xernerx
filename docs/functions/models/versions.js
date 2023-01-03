export default function loadVersions() {

    (async () => {
        for (let i = 3; i > 0; i--) {
            const version = await import(`../../versions/v${i}.js`);

            const select = document.getElementById('version');

            const option = document.createElement('option');

            option.value = `V${i}`;

            option.innerText = `Version ${i}`

            select.appendChild(option);

            console.log(version.default)
        }
    })();

    return "e"
}