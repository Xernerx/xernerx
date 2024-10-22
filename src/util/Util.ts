/** @format */

import { XernerxClient } from "../main.js";

export class Util {
  public declare readonly client: XernerxClient;

  constructor(client: XernerxClient) {
    this.client = client;
  }
}
