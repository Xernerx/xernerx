/** @format */

export default [
	{
		version: '4.8.3',
		title: 'XernerxShardClient timeout update',
		changes: ['+ Message when using timeout on XernerxShardClient', '+ Message when a shard is being killed automatically'],
	},
	{
		version: '4.8.2',
		title: 'XernerxLog RAM usage',
		changes: ['+ RAM usage to XernerxLog'],
	},
	{ version: '4.8.1', title: '', changes: ['* XernerxClient#CommandStart & XernerxClient#CommandFinish consitency'] },
	{ version: '4.8.0', title: '', changes: ['+ loaded file names in XernerxLog', '+ XernerxInteraction#util#parsed', '+ XernerxMessage#util#parsed#args', '+ this.utils on XernerxCommands'] },
	,
	{
		version: '4.7.1',
		title: '',
		changes: [
			'^ zod@3.22.0 => zod@3.22.2',
			'~ default permissions [] => null',
			'+ autocomplete to all permissions',
			'- XernerxClient generic',
			'~ XernerxIntent export way',
			'+ XernerxClient#Cooldowns',
			'* XernerxClientType',
			'~ typeof CommandBlock#reason: string => object',
			'+ CommandBlock#command',
			'+ UserPermission validation',
			'* permission validation',
			'* cooldown validation',
		],
	},
];

/**
 * + Add
 * - Delete
 * ~ Change
 * * Fix
 * ^ Update
 */
