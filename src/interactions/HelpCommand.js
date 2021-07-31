const Discord = require("discord.js");
const client = require("../Elixir");

client.once("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "help") {

        await interaction.reply({embeds: [client.embeds.fetchHelpCommandEmbed(client)]})

    }

});