import {Client} from "discord.js";
import IntentsBuilder from "./utils/IntentHandler";
import {DisTube} from "distube";
import Util from "./utils/Util";
import BaseApp from "./base/BaseApp";
import BaseEvent from "./base/BaseEvent";

export const client = new Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: IntentsBuilder.getIntents()
});

export const player = new DisTube(client, Util.getMusicOptions());

new BaseApp(client).login();
new BaseEvent(client);

export default {
    client, player
};