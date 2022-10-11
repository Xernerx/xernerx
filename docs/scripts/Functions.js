import versions from "./versions.js";

export function loadVersions() {
    const menu = document.getElementById("version-menu");
    const page = document.getElementById("page");

    for (const [version, data] of Object.entries(versions)) {
        const option = document.createElement("option");

        option.innerText = version;

        for (const [name, value] of (Object.entries(data))) {
            const div = document.createElement('div');
            const header = document.createElement("h1");
            const p = document.createElement("p");
            const code = document.createElement("code");
            const table = document.createElement('table');

            header.innerText = name;

            p.innerText = value.description;

            if (Array.isArray(value.params)) {
                let i = 0;
                for (const param of value.params) {
                    if (i <= 0) {
                        const thr = document.createElement('tr');

                        thr.classList.add('table-header')

                        for (const k of Object.keys(param)) {
                            const th = document.createElement('th');

                            th.innerText = k;

                            thr.appendChild(th);
                        }

                        table.appendChild(thr);

                        i++;
                    }

                    const thd = document.createElement('tr');

                    for (const v of Object.values(param)) {
                        const td = document.createElement('td');

                        td.innerText = v;

                        thd.appendChild(td);
                    }

                    table.appendChild(thd);
                }
            }

            code.innerText = value.example;
            code.lang = 'js';
            code.classList.add('code')

            div.appendChild(header);
            div.appendChild(p);
            div.appendChild(table)
            // div.appendChild(code);

            div.classList.add('component')

            page.appendChild(div);
            menu.appendChild(header)
        }

        menu.appendChild(option);
    }
}

