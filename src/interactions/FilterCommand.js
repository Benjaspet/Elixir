const Discord = require("discord.js");
const client = require("../Elixir");
const {deployAllSlashCommands} = require("../slash/SlashBase");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "filter") {

        const {value: string} = interaction.options.get("type");

        client.player.setFilter(string);

    }

});