import {Client} from "discord.js";
import CommandBuilder from "./builders/CommandBuilder";
import AppBuilder from "./builders/AppBuilder";
import IntentsBuilder from "./builders/IntentsBuilder";
import * as Distube from "distube";
import ElixirUtil from "./utils/ElixirUtil";

export const client = new Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: IntentsBuilder.getIntents()
});

export const player = new Distube.DisTube(client, ElixirUtil.getMusicOptions());

new AppBuilder(client);
new CommandBuilder(client);

export default {
    client, player
};