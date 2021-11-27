import {client, player} from "../../Elixir";
import DatabaseUtil from "../../utils/DatabaseUtil";
import {MessageEmbed} from "discord.js";
import ElixirUtil from "../../utils/ElixirUtil";

player.on("addSong", async (queue, song) => {

    const embed = new MessageEmbed()
        .setThumbnail(song.thumbnail)
        .setDescription(`` +
            `**Queued:** [${song.name}](${song.url})` + "\n" +
            `**Duration:** ${song.formattedDuration || "Unavailable."}`)
        .setColor("PURPLE")
        .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${ElixirUtil.cleanDurationFormat(queue.duration * 1000)}`)
        .setFooter("Elixir Music", client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

    DatabaseUtil.addPlayedSong(1);

    queue.textChannel.send({embeds: [embed]}).then(() => {});
});