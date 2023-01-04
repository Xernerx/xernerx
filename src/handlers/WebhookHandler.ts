"use strict"

import { XernerxClient } from "../main.js";
import { AutoPoster } from 'topgg-autoposter';
import SDK from '@top-gg/sdk';
import { Style } from 'dumfunctions';
import express from 'express';

interface WebhookOptions {
    token: string,
    logging: boolean
}

export default class WebhookHandler {
    client: XernerxClient;

    constructor(client: XernerxClient) {
        this.client = client;

        this.vote = this.vote;

        this.post = this.post;
    }

    post(options: WebhookOptions) {
        const auto = AutoPoster(options.token, this.client)

        auto
            .on('posted', post => {
                if (options.logging) console.info(Style.log(`Xernerx | Successfully posted bot stats to Top.gg!`, { color: Style.TextColor.Cyan }))
                return this.client.emit('webhookPost', post)
            })
            .on('error', error => {
                if (options.logging) console.info(Style.log(`Xernerx | An error occurred while posting stats to Top.gg, ${error}.`, { color: Style.BackgroundColor.Red }))
                return this.client.emit('webhookError', error)
            })

        return auto;
    }

    vote(options: WebhookOptions) {
        const app = express()

        const webhook = new SDK.Webhook(options.token)

        app.post("/dblwebhook", webhook.listener(vote => {
            console.log(vote)
        }));

        app.listen(80);

        console.log(app)
    }
}