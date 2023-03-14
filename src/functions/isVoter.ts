import { hasVoted } from 'dbl-sdk';
import XernerxClient from '../main.js';
import { XernerxUser } from '../types/extenders.js';

export default async function isVoter(user: XernerxUser, client: XernerxClient, token: string, host: 'top.gg') {
    const x = await hasVoted(user.id, client.user?.id as string, token, host);

    console.log(x);
}
