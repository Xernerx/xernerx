/** @format */

export class XernerxEvent {
	public declare readonly _id: string;
	public declare readonly name: string;
	public declare readonly description: string;
	public declare readonly filetype: 'XernerxEvent';
	public declare readonly collection: 'events';

	constructor(options: any) {
		this._id = options.id;

		this.name = options.name;

		this.description = options.description;

		this.filetype = 'XernerxEvent';

		this.collection = 'events';
	}
}
