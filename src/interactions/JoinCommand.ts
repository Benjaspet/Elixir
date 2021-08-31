import player from "../managers/MusicManager";
import VoiceManager from "../managers/VoiceManager";
import * as Discord from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "join") {
            DatabaseUtil.addExecutedCommand(1);
            const channel = interaction.member?.voice.channel;
            if (!channel) {
                return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});
            }
            await VoiceManager.connectToVoiceChannel(channel);
            const embed = new Discord.MessageEmbed()
                .setColor("PURPLE")
                .setDescription("I've joined and bound myself to the voice channel.")
            return await interaction.reply({embeds: [embed]});
        }
    }
}