/** @format */

export class XernerxMessageCommand {
  public declare readonly _id: string;
  public declare readonly name: string;
  public declare readonly description: string;
  public declare readonly global: boolean;
  public declare readonly filetype: "XernerxMessageCommand";
  public declare readonly collection: "message.commands";

  constructor(options: any) {
    this._id = options.id;

    this.name = options.name;

    this.description = options.description;

    this.global = options.global ?? true;

    this.filetype = "XernerxMessageCommand";

    this.collection = "message.commands";
  }
}
