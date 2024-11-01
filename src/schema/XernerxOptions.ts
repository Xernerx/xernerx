/** @format */

import { z } from 'zod';

export const XernerxOptionsSchema = {
	// required settings
	token: z.string().or(z.null()).default(null),
	// optional settings

	// dev
	debug: z.boolean().default(false),

	// setup
	log: z
		.object({
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
