import * as Discord from "discord.js";
import ElixirHandler from "./ElixirHandler";
import config from "./resources/Config";
import DatabaseManager from "./managers/DatabaseManager";
import CommandBuilder from "./builders/CommandBuilder";
import AppBuilder from "./builders/AppBuilder";
import IntentsBuilder from "./builders/IntentsBuilder";

const client = new Discord.Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: IntentsBuilder.getIntents(),
});

export default client;

DatabaseManager.createAllTables();
new CommandBuilder(client);
new AppBuilder(client);

client.login(config.token).then(() => {});