import {player, client} from "../../Elixir";
import * as Discord from "discord.js";
import ElixirUtil from "../../utils/ElixirUtil";
import EmbedUtil from "../../utils/EmbedUtil";

player.on("addSong", (queue, song) => {
    try {
        const embed = new Discord.MessageEmbed()
            .setDescription(`` +
                `**Queued:** ${song.name}]${song.url}` + "\n" +
                `**Duration:** ${song.formattedDuration || "Unavailable."}`)
            .setColor("PURPLE")
            .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${ElixirUtil.cleanDurationFormat(queue.duration * 1000)}`)
            .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
        queue.textChannel.send({embeds: [embed]})
            .then(() => {});
    } catch (error) {
        queue.textChannel.send({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error ocurred.")]}).then(() => {});
    }
});