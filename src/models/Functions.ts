export function logStyle(text: string, type: string, color: string) {
	if (type.toLowerCase() == "text") {
		if (color.toLowerCase() == "red") return `\u001b[0;31m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "green") return `\u001b[0;32m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "yellow")
			return `\u001b[0;33m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "blue") return `\u001b[0;34m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "purple")
			return `\u001b[0;35m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "cyan") return `\u001b[0;36m${text}\u001b[0;0m`;
	}

	if (type.toLowerCase() == `background`) {
		if (color.toLowerCase() == "red") return `\u001b[0;41m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "green") return `\u001b[0;42m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "yellow")
			return `\u001b[0;43m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "blue") return `\u001b[0;44m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "purple")
			return `\u001b[0;45m${text}\u001b[0;0m`;
		if (color.toLowerCase() == "cyan") return `\u001b[0;46m${text}\u001b[0;0m`;
	}
}
