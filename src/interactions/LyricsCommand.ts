import Genius from "genius-lyrics";
import * as Discord from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import LyricScrapeUtil from "../utils/LyricScrapeUtil";
import LyricFetchUtil from "../utils/LyricFetchUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "lyrics") {
            await interaction.deferReply();
            try {
                const song = interaction.options.getString("song");
                const result = await LyricFetchUtil.searchForSong(song);
                if (!result) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "Cannot find that song.")]});
                }
                const lyrics = await LyricFetchUtil.getLyrics(result.url);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Lyrics`)
                    .setColor("PURPLE")
                    .setDescription(lyrics.substr(0, 2000))
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                return await interaction.editReply({embeds: [embed]});
            } catch (error) {
                console.log(error)
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred.")]});
            }
        }
    }
}