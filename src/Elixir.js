const Discord = require("discord.js");
const Distube = require("distube");
const fs = require("fs");

const client = new Discord.Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        //Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.GUILD_MESSAGES, // this will become privileged in latter APIv9
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.events = new Discord.Collection();
client.dev = require("./slash/DevInterface");
client.embeds = require("./utils/EmbedUtil");
client.config = require("./resources/config.json");
client.slash = require("./slash/SlashBase");
client.player = new Distube.default(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: true,
    savePreviousSongs: true,
    emptyCooldown: 10,
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: true,
    customFilters: {
        "clear": "dynaudnorm=f=200",
        "lowbass": "bass=g=6,dynaudnorm=f=200",
        "bassboost": "bass=g=20,dynaudnorm=f=200",
        "purebass": "bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08",
        "8D": "apulsator=hz=0.08",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "phaser": "aphaser=in_gain=0.4",
        "tremolo": "tremolo",
        "vibrato": "vibrato=f=6.5",
        "reverse": "areverse",
        "treble": "treble=g=5",
        "normalizer": "dynaudnorm=f=200",
        "surrounding": "surround",
        "pulsator": "apulsator=hz=1",
        "subboost": "asubboost",
        "karaoke": "stereotools=mlev=0.03",
        "flanger": "flanger",
        "gate": "agate",
        "haas": "haas",
        "mcompand": "mcompand"
    }
});

module.exports = client;

["EventHandler"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(client.config.token).then(response => {});