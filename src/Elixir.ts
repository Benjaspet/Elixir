import {Client} from "discord.js";
import IntentsBuilder from "./utils/IntentHandler";
import BaseApp from "./base/BaseApp";
import BaseEvent from "./base/BaseEvent";
import {Player} from "discord-player";
import MusicPlayer from "./utils/Player";

export const client: Client = new Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: IntentsBuilder.getIntents()
});

export const player: Player = new Player(client, MusicPlayer.getOptions());

new BaseApp(client).login();
new BaseEvent(client);

export default {
    client, player
};