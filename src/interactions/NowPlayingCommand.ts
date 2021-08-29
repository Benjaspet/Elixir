import EmbedUtil from "../utils/EmbedUtil";
import player from "../managers/MusicManager";
import * as Discord from "discord.js";
import ElixirUtil from "../utils/ElixirUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {


        if (!interaction.isCommand()) return;
        if (interaction.commandName === "nowplaying") {
            try {
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There is no queue for the server.")]});
                }
                const track = queue.songs[0];
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${track.name}`.substr(0, 256))
                    .setColor("PURPLE")
                    .setThumbnail(track.thumbnail)
                    .setDescription(`Views: ${ElixirUtil.cleanFormat(track.views)} | Duration: ${track.formattedDuration}
                    Likes: ${ElixirUtil.cleanFormat(track.likes)} | Dislikes: ${ElixirUtil.cleanFormat(track.dislikes)}
                    Song ID: ${track.id} | URL: [click here!](${track.url})`)
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                return await interaction.reply({embeds: [embed]});
            } catch (error) {
                console.log(error);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred while running this command.")]});
            }
        }

    }
}