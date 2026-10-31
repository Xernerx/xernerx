/** @format */

/**
 * Official Xernerx CLI for scaffolding (`create-xernerx-app` / `xernerx create`)
 * and managing (`xernerx dev`, `xernerx build`, `xernerx start`) Xernerx Discord bot applications.
 *
 * @module xernerx/cli
 */

import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { Spinner, Terminal, terminal } from '@xernerx/terminal';

// Immediately stop the default singleton spinner started by `@xernerx/terminal` on import
terminal.stop();

/**
 * Supported package managers detected from `npm_config_user_agent`.
 */
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

/**
 * Supported project languages for `create-xernerx-app`.
 */
export type ProjectLanguage = 'ts' | 'js';

/**
 * Selectable `@xernerx/*` ecosystem integrations when scaffolding a new bot app.
 */
export type XernerxIntegration = 'commands' | 'stats' | 'hooks' | 'websocket';

/**
 * Configuration options for scaffolding a new Xernerx application via {@link XernerxCLI.create}.
 */
export interface CreateAppOptions {
	/** Target directory or project name. */
	projectName?: string;
	/** Language template (`'ts'` for TypeScript or `'js'` for JavaScript). */
	language?: ProjectLanguage;
	/** Enabled `@xernerx/*` ecosystem integrations. */
	integrations?: XernerxIntegration[];
	/** Discord Bot Token (`TOKEN` in `.env`). */
	token?: string;
	/** Discord Development Guild ID (`GUILD_ID` in `.env`). */
	guildId?: string;
	/** Bot Owner Discord User ID (`OWNER_ID` in `.env`). */
	ownerId?: string;
	/** Xernerx Suite API Token (`XERNERX_TOKEN` in `.env`). */
	xernerxToken?: string;
	/** Webhook secret for `@xernerx/hooks` (`WEBHOOK_SECRET` in `.env`). */
	webhookSecret?: string;
	/** WebSocket token for `@xernerx/websocket` (`WS_TOKEN` in `.env`). */
	wsToken?: string;
	/** Package manager to use for dependency installation. */
	packageManager?: PackageManager;
	/** Whether to skip automatic dependency installation. */
	skipInstall?: boolean;
	/** Whether to skip `git init`. */
	skipGit?: boolean;
	/** Run non-interactively using defaults. */
	yes?: boolean;
}

/**
 * Options for running `xernerx dev`, `xernerx build`, or `xernerx start`.
 */
export interface LifecycleOptions {
	/** Working directory of the bot project (defaults to `process.cwd()`). */
	cwd?: string;
	/** Custom entry file override. */
	entry?: string;
}

/**
 * Official class-based CLI runner for the `xernerx` all-in-one package.
 *
 * Provides interactive project scaffolding (`npx create-xernerx-app` / `xernerx create`)
 * as well as project lifecycle commands (`xernerx dev`, `xernerx build`, `xernerx start`).
 *
 * @example
 * ```ts
 * import { XernerxCLI } from 'xernerx';
 *
 * const cli = new XernerxCLI();
 * await cli.run(process.argv.slice(2));
 * ```
 */
export class XernerxCLI {
	/** Formatted `@xernerx/terminal` logger instance used by the CLI. */
	public readonly terminal: Terminal;
	/** ANSI color code for Xernerx brand purple (`#8b7cf6`). */
	public readonly xerple = '\x1b[38;2;139;124;246m';
	/** ANSI reset escape sequence. */
	public readonly reset = '\x1b[0m';
	/** ANSI bold escape sequence. */
	public readonly bold = '\x1b[1m';
	/** ANSI dim escape sequence. */
	public readonly dim = '\x1b[2m';

	/** Active child process during `xernerx dev` or `xernerx start`. */
	private activeChild: ChildProcess | null = null;

	/**
	 * Creates a new `XernerxCLI` instance.
	 */
	constructor() {
		terminal.stop();
		this.terminal = new Terminal({ title: 'XERNERX', scope: 'CLI', spin: false });
	}

	/**
	 * Parses CLI arguments and dispatches to the appropriate command handler.
	 *
	 * Automatically enters `create` mode when invoked via `create-xernerx-app`.
	 *
	 * @param argv - Command-line arguments (`process.argv.slice(2)`).
	 */
	public async run(argv: string[] = process.argv.slice(2)): Promise<void> {
		const invokedBin = path.basename(process.argv[1] || '').toLowerCase();
		const isCreateBin = invokedBin.includes('create-xernerx-app');

		const args = [...argv];
		const flags = new Set(args.filter((arg) => arg.startsWith('-')));
		const positional = args.filter((arg) => !arg.startsWith('-'));

		if (flags.has('--version') || flags.has('-v')) {
			this.terminal.info(`xernerx v${this.getVersion()}`);
			return;
		}

		if (flags.has('--help') || flags.has('-h')) {
			this.printHelp(isCreateBin);
			return;
		}

		if (isCreateBin) {
			await this.create(this.parseCreateFlags(positional[0], flags));
			return;
		}

		const command = (positional[0] || '').toLowerCase();

		switch (command) {
			case 'create':
			case 'init':
			case 'new':
				await this.create(this.parseCreateFlags(positional[1], flags));
				break;
			case 'dev':
				await this.dev({ entry: positional[1] });
				break;
			case 'build':
				await this.build();
				break;
			case 'start':
				await this.start({ entry: positional[1] });
				break;
			case 'help':
			default:
				this.printHelp(false);
				break;
		}
	}

	/**
	 * Scaffolds a new Xernerx Discord bot application (`create-xernerx-app` / `xernerx create`).
	 *
	 * @param options - Optional pre-filled configuration options.
	 */
	public async create(options: CreateAppOptions = {}): Promise<void> {
		this.printBanner();

		const detectedPm = options.packageManager ?? this.detectPackageManager();
		const nonInteractive = Boolean(options.yes || !process.stdin.isTTY);

		const projectName = options.projectName || (nonInteractive ? 'my-xernerx-bot' : await this.promptText('What is your project named?', 'my-xernerx-bot'));

		const targetDir = path.resolve(process.cwd(), projectName);
		const safePkgName =
			path
				.basename(targetDir)
				.toLowerCase()
				.replace(/[^a-z0-9-_]/g, '-')
				.replace(/^-+|-+$/g, '') || 'my-xernerx-bot';

		if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
			this.terminal.error(`Directory "${projectName}" already exists and is not empty.`);
			process.exit(1);
		}

		const language: ProjectLanguage =
			options.language ||
			(nonInteractive
				? 'ts'
				: await this.promptSelect<ProjectLanguage>('Would you like to use TypeScript or JavaScript?', [
						{ label: 'TypeScript (Recommended)', value: 'ts' },
						{ label: 'JavaScript', value: 'js' },
					]));

		const integrations: XernerxIntegration[] =
			options.integrations ||
			(nonInteractive
				? ['commands', 'stats']
				: await this.promptMultiSelect<XernerxIntegration>('Which Xernerx integrations would you like to enable?', [
						{
							label: '@xernerx/commands — Developer commands (jsk) & command sync',
							value: 'commands',
							checked: true,
						},
						{
							label: '@xernerx/stats — Automatic bot telemetry & stats reporting',
							value: 'stats',
							checked: true,
						},
						{
							label: '@xernerx/hooks — Webhook receiver & engagement cache (voted, reviewed, tipped)',
							value: 'hooks',
							checked: false,
						},
						{
							label: '@xernerx/websocket — Xernerx Suite WebSocket RPC client',
							value: 'websocket',
							checked: false,
						},
					]));

		const token = options.token ?? (nonInteractive ? '' : await this.promptText('Discord Bot Token (leave blank to configure later):', ''));
		const guildId = options.guildId ?? (nonInteractive ? '' : await this.promptText('Development Discord Guild ID (optional):', ''));
		const ownerId = options.ownerId ?? (nonInteractive ? '' : await this.promptText('Bot Owner Discord User ID (optional):', ''));

		const needsXernerxToken = integrations.includes('commands') || integrations.includes('stats') || integrations.includes('hooks');
		const xernerxToken = options.xernerxToken ?? (nonInteractive || !needsXernerxToken ? '' : await this.promptText('Xernerx Suite API Token (optional):', ''));

		const webhookSecret = options.webhookSecret ?? (nonInteractive || !integrations.includes('hooks') ? '' : await this.promptText('Xernerx Webhook Secret (optional):', ''));

		const wsToken = options.wsToken ?? (nonInteractive || !integrations.includes('websocket') ? '' : await this.promptText('Xernerx WebSocket Token (optional):', ''));

		const spinner = new Spinner({ text: `Scaffolding ${safePkgName}...` });
		spinner.start();

		try {
			this.scaffoldProject(targetDir, {
				pkgName: safePkgName,
				language,
				integrations,
				token,
				guildId,
				ownerId,
				xernerxToken,
				webhookSecret,
				wsToken,
				packageManager: detectedPm,
			});
			spinner.succeed(`Scaffolded project in ${this.xerple}${targetDir}${this.reset}`);
		} catch (err) {
			spinner.fail(`Failed to scaffold project: ${(err as Error).message}`);
			process.exit(1);
		}

		if (!options.skipGit) {
			try {
				spawnSync('git', ['init'], { cwd: targetDir, stdio: 'ignore' });
				this.terminal.info('Initialized an empty Git repository.');
			} catch {
				// Ignore if git is not installed
			}
		}

		if (!options.skipInstall) {
			const installSpinner = new Spinner({
				text: `Installing dependencies with ${detectedPm}...`,
			});
			installSpinner.start();

			const installResult = spawnSync(detectedPm, ['install'], {
				cwd: targetDir,
				stdio: 'pipe',
				shell: process.platform === 'win32',
			});

			if (installResult.status === 0) {
				installSpinner.succeed(`Installed dependencies using ${this.bold}${detectedPm}${this.reset}`);
			} else {
				installSpinner.warn(`Could not automatically install dependencies with ${detectedPm}. Run "${detectedPm} install" manually.`);
			}
		}

		const relPath = path.relative(process.cwd(), targetDir) || '.';
		const runPrefix = detectedPm === 'npm' ? 'npm run' : detectedPm;

		process.stdout.write('\n');
		this.terminal.info(`Created ${this.bold}${safePkgName}${this.reset} at ${this.xerple}${targetDir}${this.reset}\n`);
		process.stdout.write(`  Next steps:\n`);
		if (relPath !== '.') {
			process.stdout.write(`    ${this.xerple}cd ${relPath}${this.reset}\n`);
		}
		if (options.skipInstall) {
			process.stdout.write(`    ${this.xerple}${detectedPm} install${this.reset}\n`);
		}
		process.stdout.write(`    ${this.xerple}${runPrefix} dev${this.reset}      ${this.dim}# Start in development watch mode${this.reset}\n`);
		process.stdout.write(`    ${this.xerple}${runPrefix} build${this.reset}    ${this.dim}# Build for production${this.reset}\n`);
		process.stdout.write(`    ${this.xerple}${runPrefix} start${this.reset}    ${this.dim}# Start production bot${this.reset}\n\n`);
		process.stdout.write(`  Documentation: ${this.xerple}https://docs.xernerx.com${this.reset}\n`);
		process.stdout.write(`  Support Server: ${this.xerple}https://xernerx.com/discord${this.reset}\n\n`);
	}

	/**
	 * Builds the current Xernerx application (`xernerx build`).
	 *
	 * Compiles TypeScript projects using `tsc` when a `tsconfig.json` file is present.
	 *
	 * @param options - Optional working directory configuration.
	 */
	public async build(options: LifecycleOptions = {}): Promise<void> {
		const cwd = options.cwd ?? process.cwd();
		const tsconfigPath = path.join(cwd, 'tsconfig.json');

		if (!fs.existsSync(tsconfigPath)) {
			this.terminal.info('JavaScript project detected (no tsconfig.json found) — skipping TypeScript build step.');
			return;
		}

		this.terminal.info('Building TypeScript project...');
		const tscBin = this.resolveTscBinary(cwd);

		const result = spawnSync(tscBin.cmd, tscBin.args, {
			cwd,
			stdio: 'inherit',
			shell: process.platform === 'win32',
		});

		if (result.status !== 0) {
			this.terminal.error('TypeScript build failed.');
			process.exit(result.status ?? 1);
		}

		this.terminal.info('Build completed successfully.');
	}

	/**
	 * Starts the current Xernerx application in production mode (`xernerx start`).
	 *
	 * Automatically triggers {@link XernerxCLI.build} first if a TypeScript project has not been compiled yet.
	 *
	 * @param options - Optional working directory and entry file configuration.
	 */
	public async start(options: LifecycleOptions = {}): Promise<void> {
		const cwd = options.cwd ?? process.cwd();
		const tsconfigPath = path.join(cwd, 'tsconfig.json');
		const entry = this.resolveEntryFile(cwd, options.entry);
		const fullEntryPath = path.resolve(cwd, entry);

		if (!fs.existsSync(fullEntryPath) && fs.existsSync(tsconfigPath)) {
			this.terminal.warn(`Entry file "${entry}" not found. Running "xernerx build" first...`);
			await this.build({ cwd });
		}

		if (!fs.existsSync(fullEntryPath)) {
			this.terminal.error(`Entry file "${entry}" does not exist. Run "xernerx build" or check your package.json "main" field.`);
			process.exit(1);
		}

		this.terminal.info(`Starting bot (${entry})...`);
		this.registerSignalHandlers();

		const envArgs = fs.existsSync(path.join(cwd, '.env')) ? ['--env-file=.env'] : [];
		this.activeChild = spawn(process.execPath, [...envArgs, fullEntryPath], {
			cwd,
			stdio: 'inherit',
			env: {
				...process.env,
				ENVIRONMENT: process.env.ENVIRONMENT || 'PRODUCTION',
				NODE_ENV: process.env.NODE_ENV || 'PRODUCTION',
			},
		});

		await new Promise<void>((resolve) => {
			this.activeChild?.on('exit', (code) => {
				resolve();
				process.exit(code ?? 0);
			});
		});
	}

	/**
	 * Starts the current Xernerx application in development watch mode (`xernerx dev`).
	 *
	 * For TypeScript projects, watches `src/` via `tsc --watch` and automatically restarts the bot process
	 * whenever compilation succeeds. For JavaScript projects, runs `node --watch`.
	 *
	 * @param options - Optional working directory and entry file configuration.
	 */
	public async dev(options: LifecycleOptions = {}): Promise<void> {
		const cwd = options.cwd ?? process.cwd();
		const tsconfigPath = path.join(cwd, 'tsconfig.json');
		const entry = this.resolveEntryFile(cwd, options.entry);
		const fullEntryPath = path.resolve(cwd, entry);

		this.registerSignalHandlers();

		if (!fs.existsSync(tsconfigPath)) {
			this.terminal.info(`Starting JavaScript project in watch mode (${entry})...`);
			const envArgs = fs.existsSync(path.join(cwd, '.env')) ? ['--env-file=.env'] : [];
			this.activeChild = spawn(process.execPath, ['--watch', ...envArgs, fullEntryPath], {
				cwd,
				stdio: 'inherit',
				env: {
					...process.env,
					ENVIRONMENT: 'DEVELOPMENT',
					NODE_ENV: 'DEVELOPMENT',
				},
			});

			await new Promise<void>((resolve) => {
				this.activeChild?.on('exit', (code) => {
					resolve();
					process.exit(code ?? 0);
				});
			});
			return;
		}

		this.terminal.info('Starting TypeScript compiler in watch mode...');
		const tscBin = this.resolveTscBinary(cwd);
		const tscWatch = spawn(tscBin.cmd, [...tscBin.args, '--watch', '--preserveWatchOutput'], {
			cwd,
			stdio: ['ignore', 'pipe', 'inherit'],
			shell: process.platform === 'win32',
		});

		let buffer = '';
		tscWatch.stdout?.on('data', (chunk: Buffer) => {
			const text = chunk.toString();
			process.stdout.write(text);
			buffer += text;

			if (buffer.includes('Watching for file changes.')) {
				const errorMatch = buffer.match(/Found (\d+) error/);
				const errorCount = errorMatch ? Number.parseInt(errorMatch[1], 10) : 0;
				buffer = '';

				if (errorCount === 0) {
					this.restartBotProcess(cwd, fullEntryPath);
				} else {
					this.terminal.warn(`Compilation finished with ${errorCount} error(s). Waiting for fixes...`);
				}
			}
		});

		await new Promise<void>((resolve) => {
			tscWatch.on('exit', (code) => {
				this.killActiveChild();
				resolve();
				process.exit(code ?? 0);
			});
		});
	}

	/**
	 * Detects the package manager used to invoke the CLI (`pnpm`, `npm`, `yarn`, or `bun`).
	 *
	 * @returns The detected {@link PackageManager}.
	 */
	public detectPackageManager(): PackageManager {
		const userAgent = process.env.npm_config_user_agent || '';
		if (userAgent.startsWith('pnpm')) return 'pnpm';
		if (userAgent.startsWith('yarn')) return 'yarn';
		if (userAgent.startsWith('bun')) return 'bun';
		if (userAgent.startsWith('npm')) return 'npm';
		return 'npm';
	}

	/**
	 * Restarts the active bot child process during `xernerx dev`.
	 *
	 * @param cwd - Working directory.
	 * @param fullEntryPath - Absolute path to the compiled entry file.
	 */
	private restartBotProcess(cwd: string, fullEntryPath: string): void {
		this.killActiveChild();

		if (!fs.existsSync(fullEntryPath)) {
			this.terminal.warn(`Compiled entry file not found at "${fullEntryPath}".`);
			return;
		}

		this.terminal.info(`Starting bot process (${path.relative(cwd, fullEntryPath)})...`);
		const envArgs = fs.existsSync(path.join(cwd, '.env')) ? ['--env-file=.env'] : [];
		this.activeChild = spawn(process.execPath, [...envArgs, fullEntryPath], {
			cwd,
			stdio: 'inherit',
			env: {
				...process.env,
				ENVIRONMENT: 'DEVELOPMENT',
				NODE_ENV: 'DEVELOPMENT',
			},
		});
	}

	/**
	 * Terminates the active child process if one is running.
	 */
	private killActiveChild(): void {
		if (this.activeChild && !this.activeChild.killed) {
			this.activeChild.kill('SIGTERM');
			this.activeChild = null;
		}
	}

	/**
	 * Registers `SIGINT` and `SIGTERM` listeners to cleanly stop child processes.
	 */
	private registerSignalHandlers(): void {
		const cleanup = () => {
			this.killActiveChild();
			process.exit(0);
		};
		process.once('SIGINT', cleanup);
		process.once('SIGTERM', cleanup);
	}

	/**
	 * Resolves the project entry point from `package.json` or falls back to `dist/main.js` / `src/main.js`.
	 *
	 * @param cwd - Project root directory.
	 * @param override - Optional explicit entry path.
	 * @returns Relative path to the entry file.
	 */
	private resolveEntryFile(cwd: string, override?: string): string {
		if (override) return override;

		const pkgJsonPath = path.join(cwd, 'package.json');
		if (fs.existsSync(pkgJsonPath)) {
			try {
				const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
				if (typeof pkg.main === 'string' && pkg.main.trim()) {
					return pkg.main.trim();
				}
			} catch {
				// Ignore malformed package.json
			}
		}

		if (fs.existsSync(path.join(cwd, 'tsconfig.json'))) {
			return 'dist/main.js';
		}

		return 'src/main.js';
	}

	/**
	 * Resolves the `tsc` binary from the project's `node_modules/.bin` or falls back to `npx tsc`.
	 *
	 * @param cwd - Project root directory.
	 * @returns Command and argument array for spawning `tsc`.
	 */
	private resolveTscBinary(cwd: string): { cmd: string; args: string[] } {
		const binName = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
		const localTsc = path.join(cwd, 'node_modules', '.bin', binName);
		if (fs.existsSync(localTsc)) {
			return { cmd: `"${localTsc}"`, args: [] };
		}
		return { cmd: 'npx', args: ['tsc'] };
	}

	/**
	 * Writes all scaffolded project files to `targetDir`.
	 */
	private scaffoldProject(
		targetDir: string,
		config: {
			pkgName: string;
			language: ProjectLanguage;
			integrations: XernerxIntegration[];
			token: string;
			guildId: string;
			ownerId: string;
			xernerxToken: string;
			webhookSecret: string;
			wsToken: string;
			packageManager: PackageManager;
		}
	): void {
		const isTs = config.language === 'ts';
		const ext = isTs ? 'ts' : 'js';
		const runtimeDir = isTs ? 'dist' : 'src';

		fs.mkdirSync(path.join(targetDir, 'src', 'commands', 'slash'), { recursive: true });
		fs.mkdirSync(path.join(targetDir, 'src', 'events'), { recursive: true });

		const pkgVersions = this.getDependencyVersions();
		const rawDeps: Record<string, string> = {
			'@xernerx/framework': pkgVersions['@xernerx/framework'],
			'@xernerx/terminal': pkgVersions['@xernerx/terminal'],
			'discord.js': '^14.22.1',
		};

		if (config.integrations.includes('commands')) {
			rawDeps['@xernerx/commands'] = pkgVersions['@xernerx/commands'];
		}
		if (config.integrations.includes('hooks')) {
			rawDeps['@xernerx/hooks'] = pkgVersions['@xernerx/hooks'];
		}
		if (config.integrations.includes('stats')) {
			rawDeps['@xernerx/stats'] = pkgVersions['@xernerx/stats'];
		}
		if (config.integrations.includes('websocket')) {
			rawDeps['@xernerx/websocket'] = pkgVersions['@xernerx/websocket'];
		}

		const dependencies = Object.fromEntries(Object.entries(rawDeps).sort(([a], [b]) => a.localeCompare(b)));

		const pkgJson: Record<string, unknown> = {
			name: config.pkgName,
			version: '0.1.0',
			description: 'A Discord bot built with the Xernerx Framework.',
			main: `${runtimeDir}/main.js`,
			type: 'module',
			scripts: isTs
				? {
						dev: 'tsc && node --watch --env-file=.env .',
						build: 'tsc',
						start: 'node --env-file=.env .',
					}
				: {
						dev: 'node --watch --env-file=.env .',
						build: 'node --check src/main.js',
						start: 'node --env-file=.env .',
					},
			engines: {
				node: '>=22',
			},
			dependencies,
		};

		if (isTs) {
			pkgJson.devDependencies = {
				'@types/node': '^24.0.0',
				'typescript': '^6.0.3',
			};
		}

		fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, '\t') + '\n', 'utf8');

		if (isTs) {
			const tsconfig = {
				include: ['src'],
				compilerOptions: {
					rootDir: './src',
					outDir: './dist',
					module: 'NodeNext',
					moduleResolution: 'NodeNext',
					target: 'ES2022',
					lib: ['ESNext'],
					types: ['node'],
					sourceMap: true,
					declaration: true,
					strict: true,
					esModuleInterop: true,
					forceConsistentCasingInFileNames: true,
					skipLibCheck: true,
				},
			};
			fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, '\t') + '\n', 'utf8');
		}

		const envLines = [
			'# Environment',
			'ENVIRONMENT="DEVELOPMENT"',
			'',
			'# Discord Bot Configuration',
			`TOKEN="${config.token}"`,
			`GUILD_ID="${config.guildId}"`,
			`OWNER_ID="${config.ownerId}"`,
			'',
			'# Xernerx Suite API',
			`XERNERX_TOKEN="${config.xernerxToken}"`,
		];

		if (config.integrations.includes('hooks')) {
			envLines.push(`WEBHOOK_SECRET="${config.webhookSecret}"`);
			envLines.push('WEBHOOK_PORT="8080"');
		}

		if (config.integrations.includes('websocket')) {
			envLines.push(`WS_TOKEN="${config.wsToken}"`);
		}

		fs.writeFileSync(path.join(targetDir, '.env'), envLines.join('\n') + '\n', 'utf8');
		fs.writeFileSync(
			path.join(targetDir, '.env.example'),
			envLines.map((line) => (line.startsWith('ENVIRONMENT=') ? line : line.includes('=') ? `${line.split('=')[0]}=""` : line)).join('\n') + '\n',
			'utf8'
		);

		fs.writeFileSync(path.join(targetDir, '.gitignore'), ['node_modules', 'dist', '.env', '*.log'].join('\n') + '\n', 'utf8');

		// Generate src/main.{ts,js}
		const mainLines: string[] = ['/** @format */', '', `import { XernerxClient } from '@xernerx/framework';`];

		if (config.integrations.includes('commands')) {
			mainLines.push(`import { XernerxCommands } from '@xernerx/commands';`);
		}
		if (config.integrations.includes('stats')) {
			mainLines.push(`import { XernerxStats } from '@xernerx/stats';`);
		}
		if (config.integrations.includes('hooks')) {
			mainLines.push(`import { XernerxHooks } from '@xernerx/hooks';`);
		}
		if (config.integrations.includes('websocket')) {
			mainLines.push(`import { XernerxWebsocket } from '@xernerx/websocket';`);
		}

		mainLines.push('');

		if (config.integrations.includes('websocket')) {
			mainLines.push(
				'export class WebSocket extends XernerxWebsocket {',
				'\tconstructor() {',
				'\t\tsuper({',
				`\t\t\ttoken: process.env.WS_TOKEN || '',`,
				`\t\t\tdev: process.env.ENVIRONMENT === 'DEVELOPMENT',`,
				'\t\t});',
				'\t}',
				'}',
				''
			);
		}

		mainLines.push('export class Client extends XernerxClient {');
		if (isTs && config.integrations.includes('websocket')) {
			mainLines.push('\tdeclare public websocket: WebSocket;');
		}
		if (isTs && config.integrations.includes('hooks')) {
			mainLines.push('\tdeclare public hooks: XernerxHooks;');
		}

		mainLines.push(
			'\tconstructor() {',
			'\t\tsuper({',
			`\t\t\tintents: ['Guilds', 'GuildMessages'],`,
			isTs ? `\t\t\ttoken: process.env.TOKEN as string,` : `\t\t\ttoken: process.env.TOKEN || '',`,
			`\t\t\tguildId: process.env.GUILD_ID || undefined,`,
			`\t\t\towners: process.env.OWNER_ID || undefined,`,
			`\t\t\tglobal: process.env.ENVIRONMENT !== 'DEVELOPMENT',`,
			'\t\t});',
			'',
			'\t\tthis.modules.eventHandler.loadEvents({',
			`\t\t\tdirectory: '${runtimeDir}/events',`,
			'\t\t});',
			'',
			'\t\tthis.modules.commandHandler.loadSlashCommands({',
			`\t\t\tdirectory: '${runtimeDir}/commands/slash',`,
			'\t\t});'
		);

		const extensionEntries: string[] = [];
		if (config.integrations.includes('commands')) {
			extensionEntries.push(['\t\t\tnew XernerxCommands(this, {', `\t\t\t\ttoken: process.env.XERNERX_TOKEN || '',`, '\t\t\t})'].join('\n'));
		}
		if (config.integrations.includes('stats')) {
			extensionEntries.push(['\t\t\tnew XernerxStats(this, {', `\t\t\t\ttoken: process.env.XERNERX_TOKEN || '',`, '\t\t\t})'].join('\n'));
		}
		if (config.integrations.includes('hooks')) {
			extensionEntries.push(
				[
					'\t\t\tnew XernerxHooks(this, {',
					`\t\t\t\tsecret: process.env.WEBHOOK_SECRET || 'secret',`,
					`\t\t\t\tport: Number(process.env.WEBHOOK_PORT || 8080),`,
					`\t\t\t\ttoken: process.env.XERNERX_TOKEN || undefined,`,
					'\t\t\t})',
				].join('\n')
			);
		}

		if (extensionEntries.length > 0) {
			mainLines.push('', '\t\tthis.modules.extensionHandler.loadExtensions(', extensionEntries.join(',\n'), '\t\t);');
		}

		if (config.integrations.includes('websocket')) {
			mainLines.push('', '\t\tthis.websocket = new WebSocket();', '\t\tthis.websocket.connect().catch(() => null);');
		}

		mainLines.push('', '\t\tthis.connect();', '\t}', '}', '', 'export const client = new Client();', '');

		fs.writeFileSync(path.join(targetDir, 'src', `main.${ext}`), mainLines.join('\n'), 'utf8');

		// Generate src/events/clientReady.{ts,js}
		const readyLines = [
			'/** @format */',
			'',
			`import { EventBuilder } from '@xernerx/framework';`,
			`import { Terminal } from '@xernerx/terminal';`,
			'',
			'export default class ClientReadyEvent extends EventBuilder {',
			isTs ? `\tprivate readonly logger = new Terminal({ scope: 'READY', spin: false });` : `\tlogger = new Terminal({ scope: 'READY', spin: false });`,
			'',
			'\tconstructor() {',
			`\t\tsuper('clientReady', {`,
			`\t\t\tname: 'clientReady',`,
			`\t\t\temitter: 'client',`,
			'\t\t\tonce: true,',
			'\t\t});',
			'\t}',
			'',
			isTs ? '\toverride async run() {' : '\tasync run() {',
			'\t\tthis.logger.info(`Logged in as ${this.client.user?.tag}!`);',
			'\t}',
			'}',
			'',
		];
		fs.writeFileSync(path.join(targetDir, 'src', 'events', `clientReady.${ext}`), readyLines.join('\n'), 'utf8');

		// Generate src/commands/slash/ping.{ts,js}
		const pingLines = [
			'/** @format */',
			'',
			isTs ? `import { SlashCommandBuilder, type SlashCommandOptions } from '@xernerx/framework';` : `import { SlashCommandBuilder } from '@xernerx/framework';`,
			'',
			'export default class PingCommand extends SlashCommandBuilder {',
			'\tconstructor() {',
			`\t\tsuper('ping', {`,
			`\t\t\tname: 'ping',`,
			`\t\t\tdescription: 'Check the bot latency.',`,
			'\t\t});',
			'\t}',
			'',
			isTs ? '\toverride async exec({ interaction }: SlashCommandOptions) {' : '\tasync exec({ interaction }) {',
			'\t\tawait interaction.util.reply({',
			'\t\t\tcontent: `Pong! Latency: **${this.client.ws.ping}ms**`,',
			'\t\t\tephemeral: true,',
			'\t\t});',
			'\t}',
			'}',
			'',
		];
		fs.writeFileSync(path.join(targetDir, 'src', 'commands', 'slash', `ping.${ext}`), pingLines.join('\n'), 'utf8');

		// Generate README.md
		const runPrefix = config.packageManager === 'npm' ? 'npm run' : config.packageManager;
		const readmeLines = [
			'<!-- @format -->',
			'',
			'![Xernerx Banner](https://xernerx.com/banner.png)',
			'',
			`# ${config.pkgName}`,
			'',
			'A Discord bot built with the [Xernerx Framework](https://docs.xernerx.com).',
			'',
			'## Scripts',
			'',
			'```bash',
			`# Start in development watch mode`,
			`${runPrefix} dev`,
			'',
			`# Build for production`,
			`${runPrefix} build`,
			'',
			`# Run production bot`,
			`${runPrefix} start`,
			'```',
			'',
			'## Links',
			'',
			'- [Xernerx Documentation](https://docs.xernerx.com)',
			'- [Discord Support Server](https://xernerx.com/discord)',
			'',
		];
		fs.writeFileSync(path.join(targetDir, 'README.md'), readmeLines.join('\n'), 'utf8');
	}

	/**
	 * Prompts the user for a single line of text input.
	 */
	private async promptText(question: string, defaultValue = ''): Promise<string> {
		terminal.stop();
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		const cleanQuestion = question.replace(/:\s*$/, '');
		const hint = defaultValue ? ` ${this.dim}(${defaultValue})${this.reset}` : '';
		return new Promise<string>((resolve) => {
			rl.question(`${this.xerple}?${this.reset} ${this.bold}${cleanQuestion}${this.reset}${hint}: `, (answer) => {
				rl.close();
				resolve(answer.trim() || defaultValue);
			});
		});
	}

	/**
	 * Renders an interactive single-choice arrow-key selector in the terminal.
	 */
	private async promptSelect<T extends string>(question: string, choices: Array<{ label: string; value: T }>): Promise<T> {
		if (!process.stdin.isTTY) {
			return choices[0].value;
		}

		return new Promise<T>((resolve) => {
			let selectedIndex = 0;

			const render = (firstRender = false) => {
				if (!firstRender) {
					readline.moveCursor(process.stdout, 0, -(choices.length + 1));
					readline.clearScreenDown(process.stdout);
				}
				process.stdout.write(`${this.xerple}?${this.reset} ${this.bold}${question}${this.reset} ${this.dim}(Use arrow keys, Enter to confirm)${this.reset}\n`);
				for (let i = 0; i < choices.length; i++) {
					const active = i === selectedIndex;
					const prefix = active ? `${this.xerple}❯${this.reset}` : ' ';
					const text = active ? `${this.xerple}${this.bold}${choices[i].label}${this.reset}` : choices[i].label;
					process.stdout.write(`  ${prefix} ${text}\n`);
				}
			};

			render(true);

			readline.emitKeypressEvents(process.stdin);
			const wasRaw = process.stdin.isRaw;
			process.stdin.setRawMode(true);
			process.stdin.resume();

			const onKeypress = (_str: string, key: readline.Key) => {
				if (!key) return;
				if (key.ctrl && key.name === 'c') {
					process.stdin.setRawMode(Boolean(wasRaw));
					process.stdin.removeListener('keypress', onKeypress);
					process.stdout.write('\n');
					process.exit(0);
				}
				if (key.name === 'up' || key.name === 'k') {
					selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
					render();
				} else if (key.name === 'down' || key.name === 'j') {
					selectedIndex = (selectedIndex + 1) % choices.length;
					render();
				} else if (key.name === 'return' || key.name === 'enter') {
					process.stdin.setRawMode(Boolean(wasRaw));
					process.stdin.removeListener('keypress', onKeypress);
					process.stdin.pause();
					resolve(choices[selectedIndex].value);
				}
			};

			process.stdin.on('keypress', onKeypress);
		});
	}

	/**
	 * Renders an interactive multi-select arrow-key selector in the terminal.
	 */
	private async promptMultiSelect<T extends string>(question: string, choices: Array<{ label: string; value: T; checked?: boolean }>): Promise<T[]> {
		if (!process.stdin.isTTY) {
			return choices.filter((c) => c.checked).map((c) => c.value);
		}

		return new Promise<T[]>((resolve) => {
			let cursor = 0;
			const checked = choices.map((c) => Boolean(c.checked));

			const render = (firstRender = false) => {
				if (!firstRender) {
					readline.moveCursor(process.stdout, 0, -(choices.length + 1));
					readline.clearScreenDown(process.stdout);
				}
				process.stdout.write(`${this.xerple}?${this.reset} ${this.bold}${question}${this.reset} ${this.dim}(Space to toggle, Enter to confirm)${this.reset}\n`);
				for (let i = 0; i < choices.length; i++) {
					const isCurrent = i === cursor;
					const pointer = isCurrent ? `${this.xerple}❯${this.reset}` : ' ';
					const box = checked[i] ? `${this.xerple}◉${this.reset}` : `${this.dim}◯${this.reset}`;
					const label = isCurrent ? `${this.bold}${choices[i].label}${this.reset}` : choices[i].label;
					process.stdout.write(`  ${pointer} ${box} ${label}\n`);
				}
			};

			render(true);

			readline.emitKeypressEvents(process.stdin);
			const wasRaw = process.stdin.isRaw;
			process.stdin.setRawMode(true);
			process.stdin.resume();

			const onKeypress = (_str: string, key: readline.Key) => {
				if (!key) return;
				if (key.ctrl && key.name === 'c') {
					process.stdin.setRawMode(Boolean(wasRaw));
					process.stdin.removeListener('keypress', onKeypress);
					process.stdout.write('\n');
					process.exit(0);
				}
				if (key.name === 'up' || key.name === 'k') {
					cursor = (cursor - 1 + choices.length) % choices.length;
					render();
				} else if (key.name === 'down' || key.name === 'j') {
					cursor = (cursor + 1) % choices.length;
					render();
				} else if (key.name === 'space') {
					checked[cursor] = !checked[cursor];
					render();
				} else if (key.name === 'a') {
					const allSelected = checked.every(Boolean);
					for (let i = 0; i < checked.length; i++) checked[i] = !allSelected;
					render();
				} else if (key.name === 'return' || key.name === 'enter') {
					process.stdin.setRawMode(Boolean(wasRaw));
					process.stdin.removeListener('keypress', onKeypress);
					process.stdin.pause();
					resolve(choices.filter((_, idx) => checked[idx]).map((c) => c.value));
				}
			};

			process.stdin.on('keypress', onKeypress);
		});
	}

	/**
	 * Parses CLI flags for `create-xernerx-app` / `xernerx create`.
	 */
	private parseCreateFlags(projectName: string | undefined, flags: Set<string>): CreateAppOptions {
		const options: CreateAppOptions = { projectName };
		if (flags.has('--ts') || flags.has('--typescript')) options.language = 'ts';
		if (flags.has('--js') || flags.has('--javascript')) options.language = 'js';
		if (flags.has('--yes') || flags.has('-y')) options.yes = true;
		if (flags.has('--skip-install')) options.skipInstall = true;
		if (flags.has('--skip-git')) options.skipGit = true;
		if (flags.has('--all')) options.integrations = ['commands', 'stats', 'hooks', 'websocket'];
		return options;
	}

	/**
	 * Prints the Xernerx CLI header banner.
	 */
	private printBanner(): void {
		process.stdout.write(
			`\n${this.xerple}${this.bold}╭──────────────────────────────────────────────╮${this.reset}\n` +
				`${this.xerple}${this.bold}│             Xernerx Bot Framework            │${this.reset}\n` +
				`${this.xerple}${this.bold}╰──────────────────────────────────────────────╯${this.reset}\n\n`
		);
	}

	/**
	 * Prints CLI usage instructions.
	 */
	private printHelp(isCreateBin: boolean): void {
		this.printBanner();
		if (isCreateBin) {
			process.stdout.write(
				`Usage: ${this.xerple}npx create-xernerx-app${this.reset} [project-directory] [options]\n\n` +
					`Options:\n` +
					`  --ts, --typescript   Use the TypeScript template\n` +
					`  --js, --javascript   Use the JavaScript template\n` +
					`  --all                Enable all @xernerx/* integrations\n` +
					`  --skip-install       Skip installing dependencies\n` +
					`  --skip-git           Skip initializing a Git repository\n` +
					`  -y, --yes            Use default options non-interactively\n` +
					`  -h, --help           Display this help message\n\n`
			);
			return;
		}

		process.stdout.write(
			`Usage: ${this.xerple}xernerx${this.reset} <command> [options]\n\n` +
				`Commands:\n` +
				`  ${this.xerple}create${this.reset} [dir]   Scaffold a new Xernerx Discord bot project\n` +
				`  ${this.xerple}dev${this.reset}            Start the bot in development watch mode\n` +
				`  ${this.xerple}build${this.reset}          Compile TypeScript to dist/\n` +
				`  ${this.xerple}start${this.reset}          Start the compiled production bot\n\n` +
				`Options:\n` +
				`  -v, --version  Print the installed xernerx version\n` +
				`  -h, --help     Display this help message\n\n`
		);
	}

	/**
	 * Reads the current `xernerx` package version from `package.json`.
	 */
	private getVersion(): string {
		try {
			const currentDir = path.dirname(fileURLToPath(import.meta.url));
			const pkgPath = path.resolve(currentDir, '..', 'package.json');
			if (fs.existsSync(pkgPath)) {
				const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
				return pkg.version || '5.1.0';
			}
		} catch {
			// Fallback version
		}
		return '5.1.0';
	}

	/**
	 * Reads the `@xernerx/*` dependency version ranges from `xernerx`'s `package.json`.
	 */
	private getDependencyVersions(): Record<string, string> {
		const defaults: Record<string, string> = {
			'@xernerx/commands': '^0.2.7',
			'@xernerx/extension-builder': '^0.1.0',
			'@xernerx/framework': '^1.1.2',
			'@xernerx/hooks': '^0.2.1',
			'@xernerx/stats': '^1.0.14',
			'@xernerx/terminal': '^1.2.0',
			'@xernerx/websocket': '^0.4.16',
		};
		try {
			const currentDir = path.dirname(fileURLToPath(import.meta.url));
			const pkgPath = path.resolve(currentDir, '..', 'package.json');
			if (fs.existsSync(pkgPath)) {
				const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
				if (pkg.dependencies && typeof pkg.dependencies === 'object') {
					return { ...defaults, ...pkg.dependencies };
				}
			}
		} catch {
			// Fallback to defaults
		}
		return defaults;
	}
}
