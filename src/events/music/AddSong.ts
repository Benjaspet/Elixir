import player from "../../managers/MusicManager";
import * as Discord from "discord.js";
import client from "../../Elixir";
import ElixirUtil from "../../utils/ElixirUtil";

player.on("addSong", (queue, song) => {

    const embed = new Discord.MessageEmbed()
        .setThumbnail(song.thumbnail)
        .setDescription(`` +
            `**Queued:** [${song.name}](${song.url})` + "\n" +
            `**Duration:** ${song.formattedDuration || "Unavailable."}` + "\n" +
            `**Likes:** ` + song.likes || "Unavailable." + " | **Dislikes:** " + song.dislikes + "\n" +
            `**Views:** ${song.views || "Unavailable."}`)
        .setColor("PURPLE")
        .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${ElixirUtil.cleanDurationFormat(queue.duration * 1000)}`)
        .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

    queue.textChannel.send({embeds: [embed]})
        .then(() => {});

});