import * as Discord from "discord.js";
import config from "../resources/Config";
import EmbedUtil from "../utils/EmbedUtil";
import player from "../managers/MusicManager";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "queue") {
            DatabaseUtil.addExecutedCommand(1);
            try {
                const queue = player.getQueue(interaction.guild.id);
                if (queue.songs.length > 20) {
                    const embed = new Discord.MessageEmbed()
                        .setColor("PURPLE")
                        .setDescription("**Total songs:** " + queue.songs.length + "\n" + "**Duration:** " + queue.formattedDuration)
                    return await interaction.reply({embeds: [embed]});
                }
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Queue for ${interaction.guild.name}`)
                    .setColor("PURPLE")
                    .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
                let counter = 0;
                for (let i = 0; i < queue.songs.length; i += 20) {
                    if (counter >= 10) break;
                    embed.setDescription("" + queue.songs.map((song, id) =>
                        `**#${id+1}** - [${song.name}](${song.url}) - ${song.formattedDuration}`).join("\n"));
                    counter++;
                }
                if (queue.songs.length > 20) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "Cannot display queue: too many songs.")]});
                }
                return await interaction.reply({embeds: [embed]});
            } catch (err) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There are no songs currently queued.")]});
            }
        }
    }
}