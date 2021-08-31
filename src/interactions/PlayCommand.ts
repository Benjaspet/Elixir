import * as Discord from "discord.js";
import player from "../managers/MusicManager";
import EmbedUtil from "../utils/EmbedUtil";
import {getTracks, getPreview} from "spotify-url-info";
import config from "../resources/Config";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "play") {
            DatabaseUtil.addExecutedCommand(1);
            try {
                const song = interaction.options.getString("song");
                const channel = interaction.member?.voice.channel;
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});
                }
                if (song.toLowerCase().includes("spotify") && song.toLowerCase().includes("playlist")) {
                    getTracks(song).then(async result => {
                        if (result.length > 35 && interaction.user.id !== config.developer.owner) {
                            return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You cannot queue playlists with more than 35 songs!")]});
                        }
                        const embed = new Discord.MessageEmbed()
                            .setTitle("Searching for the playlist...")
                            .setColor("PURPLE")
                            .setDescription("Total songs: " + result.length)
                            .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                        await interaction.reply({embeds: [embed]});
                        return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                    });
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Searching the songbase...")
                        .setColor("PURPLE")
                        .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({embeds: [embed]});
                    return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                }
            } catch (error) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred during playback.")]});
            }
        }
    }
}