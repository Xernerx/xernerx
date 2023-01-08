export default function formatCode(string) {
    string = string.replace("class", "NotCSSClass")
    string = string.replace(/ {12}| {16}/gi, "");

    if (string.match(/'.*?'/)) {
        string.match(/'.*?'/).map(word => {
            string = string.replace(word, `<span%20class="word-string">${word.replace(/ +/, "%20")}</span>`)
        })
    }

    if (string.match(/\w*?(\(.*?\))/g)) {
        string.match(/\w*?(\(.*?\))/g)?.map(list => {
            const [name, params] = list.replace(/\(/gi, "%20(").split(/%20/gi);

            string = string.replace(name, `<span%20class="word-class-name">${name}</span>`)

            string = string.replace(params, `(${params.replace(/\(|\)/g, "").split(/, +/gi).map(word => `<span%20class="word-parameter">${word}</span>`).join(',%20')})`)
        })
    }

    if (string.match(/import (\w*) from|NotCSSClass (\w*) extends/gi)) {
        string.match(/import (\w*) from|NotCSSClass (\w*) extends/gi).map(word => {
            string = string.replace(word.split(/ /)[1], `<span%20class="word-class-name">${word.split(/ /)[1]}</span>`)
        });
    }

    if (string.match(/\w*\(/gi)) {
        string.match(/\w*\(/gi).map(word => {
            if (word === '(') return;

            string = string.replace(word, `<span%20class="word-class-name">${word.replace(/\(/, "")}</span>(`)
        })
    }

    string.split(/\s/gi).map(word => {
        if (word.includes("span") || word === "") return;
        else if (word == 'NotCSSClass') string = string.replace(word, `<span%20class="word-class">class</span>`)
        else string = string.replace(word, `<span%20class="word-${word}">${word}</span>`)
    })


    return `<pre>${string.replace(/%20/gi, " ")}</pre>`
}