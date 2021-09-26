import {client, player} from "../../Elixir";
import DatabaseUtil from "../../utils/DatabaseUtil";
import VoiceManager from "../../managers/VoiceManager";
import {MessageEmbed} from "discord.js";
import ElixirUtil from "../../utils/ElixirUtil";
import EmbedUtil from "../../utils/EmbedUtil";

player.on("addSong", async (queue, song) => {
    DatabaseUtil.addPlayedSong(1);
    if (VoiceManager.sendFollowUp[0] == true) {
        try {
            const queueLength = queue.songs.length == 1 ? "‣ Song count: 1 song." : "‣ Song count: " + queue.songs.length + " songs.";
            const embed = new MessageEmbed()
                .setDescription(`` +
                    `**Queued:** [${song.name}](https://open.spotify.com)` + "\n" +
                    `**Duration:** ${song.formattedDuration || "Unavailable."}`)
                .setColor("PURPLE")
                .addField(`Total Queue`, `${queueLength}\n‣ Duration: ${ElixirUtil.cleanDurationFormat(queue.duration * 1000)}`)
                .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            queue.textChannel.send({embeds: [embed]})
                .then(() => {});
        } catch (error) {
            console.log(error);
            await queue.textChannel.send({
                embeds: [EmbedUtil.fetchEmbedByType(client,
                    "error", "An error occurred during playback.")]
            });
        }
    }
});