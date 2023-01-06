export default function formatCode(string) {
    if (string.match(/\w*?(\(.*?\))/g)) string.match(/\w*?(\(.*?\))/g)?.map(list => {
        const [name, params] = list.replace(/\(/gi, "%20(").split(/%20/gi);

        string = string.replace(name, `<span%20class="word-class">${name}</span>`)

        string = string.replace(params, `(${params.replace(/\(|\)/g, "").split(/, +/gi).map(word => `<span%20class="word-parameter">${word}</span>`).join(',%20')})`)
    })

    string.split(/ /gi).map(word => {
        if (word.includes('span')) return;

        string = string.replace(word, `<span%20class="word-${word}">${word}</span>`)
    })

    return `<pre>${string.replace(/%20/gi, " ")}</pre>`
}