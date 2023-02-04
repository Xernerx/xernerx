export default {
	"name": "xernerx",
	"version": "3.4.3",
	"type": "module",
	"description": "A bot framework for discord.js.",
	"main": "dist/main.js",
	"keywords": [
		"discord.js",
		"discord",
		"framework"
	],
	"author": "Dummi",
	"license": "MIT",
	"homepage": "https://xernerx.github.io/xernerx/home.html",
	"packageManager": "npm@8.5.5",
	"scripts": {
		"start": "npm i && npm fund && npm audit fix --force && npm link && tsc -w",
		"patch": "npm run build && tsc && git add . && npm run commit && npm version patch && npm publish && git push",
		"minor": "npm run build && tsc && git add . && npm run commit && npm version minor && npm publish && git push",
		"major": "npm run build && tsc && git add . && npm run commit && npm version major && npm publish && git push",
		"site": "git add docs && npm run commit && git push",
		"commit": "node ../.scripts/commit.js",
		"build": "node ../.scripts/rewritePackage.js"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/xernerx/xernerx.git"
	},
	"bugs": {
		"url": "https://github.com/xernerx/xernerx/issues"
	},
	"dependencies": {
		"@sapphire/shapeshift": "^3.8.1",
		"discord.js": "^14.7.0",
		"dumfunctions": "^2.0.0",
		"xernerx-extension-builder": "^0.0.2"
	},
	"devDependencies": {
		"typescript": "^4.9.4"
	}
}
