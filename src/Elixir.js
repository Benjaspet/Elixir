const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGES, // this will become privileged in latter APIv9
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.events = new Discord.Collection();
client.config = require("./resources/config.json");
client.slash = require("./slash/SlashBase");

module.exports = client;

["EventHandler"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(client.config.token).then(response => console.log("✔ Elixir.js loaded."));