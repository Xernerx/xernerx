/** @format */
/**
 * @module: Builder
 * @description: Represents a context command in Xernerx Framework.
 *
 */

export class XernerxContextCommand {
	public declare readonly _id: string;
	public declare readonly name: string;
	public declare readonly description: string;
	public declare readonly global: boolean;
	public declare readonly filetype: 'XernerxContextCommand';
	public declare readonly collection: 'context.commands';

	constructor(options: any) {
		this._id = options.id;

		this.name = options.name;

		this.description = options.description;

		this.global = options.global ?? true;

		this.filetype = 'XernerxContextCommand';

		this.collection = 'context.commands';
	}
}
