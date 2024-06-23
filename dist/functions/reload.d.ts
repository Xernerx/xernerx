/** @format */
import XernerxClient from '../client/XernerxClient.js';
export default function reload(client: XernerxClient, type: 'commands' | 'context' | 'message' | 'slash' | 'events' | 'inhibitors'): Promise<true | void | null>;
