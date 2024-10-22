/** @format */

export class XernerxInhibitor {
  public declare readonly _id: string;
  public declare readonly name: string;
  public declare readonly description: string;
  public declare readonly filetype: "XernerxInhibitor";
  public declare readonly collection: "inhibitors";

  constructor(options: any) {
    this._id = options.id;

    this.name = options.name;

    this.description = options.description;

    this.filetype = "XernerxInhibitor";

    this.collection = "inhibitors";
  }
}
