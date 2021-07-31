const Discord = require("discord.js");
const client = require("../Elixir");
const {deployAllSlashCommands} = require("../slash/SlashBase");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.user.id !== client.config.developer.owner) {

        return await interaction.reply({content: "You must be a bot developer to run this command."});

    }

    if (interaction.commandName === "deploy") {

        await deployAllSlashCommands(client, false);
        await interaction.reply({content: "Slash commands successfully deployed."});

    }

});