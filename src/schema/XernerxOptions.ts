/** @format */

import { z } from 'zod';

export const XernerxOptionsSchema = {
	// required settings
	token: z.string().or(z.null()).default(null),
	global: z.boolean().default(false),
	guilds: z.array(z.string()).default([]),

	// optional settings
	owners: z.array(z.string()).default([]),

	// dev
	debug: z.boolean().default(false),

	// setup
	log: z
		.object({
			dashboard: z.boolean().default(false),
			type: z.enum(['dynamic', 'static']).default('static'),
			levels: z
				.object({
					error: z.boolean().default(false),
					warn: z.boolean().default(false),
					info: z.boolean().default(false),
					debug: z.boolean().default(false),
				})
				.default({}),
		})
		.default({}),
};
