import {Client} from "discord.js";
import {Player} from "discord-player";
import BaseApp from "./base/BaseApp";
import BaseEvent from "./base/BaseEvent";
import MusicPlayer from "./utils/MusicPlayer";
import Util from "./utils/Util";

export const client: Client = new Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: Util.getIntents()
});

export const player: Player = new Player(client, MusicPlayer.getOptions());

new BaseApp(client).login();
new BaseEvent(client);

export default {
    client, player
};