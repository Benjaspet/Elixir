import {client, player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import * as Discord from "discord.js";
import PlayCommand from "../commands/PlayCommand";
import {MessageEmbed} from "discord.js";
import Util from "../utils/Util";
import Logger from "../Logger";
import EmbedUtil from "../utils/EmbedUtil";
import {PlayerError, Queue} from "discord-player";

player.on("addList", async (queue, playlist) => {
    await DatabaseUtil.addPlaylistPlayed(1);
    const embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription("[Playlist queued successfully.](" + playlist.url + ")")
        .setFooter(`Elixir Music`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
    queue.textChannel.send({embeds: [embed]}).then(() => {});
});

player.on("addSong", async (queue, song) => {
    if (PlayCommand.followUp.get(queue.textChannel.guild.id) == true) {
        const embed = new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`` +
                `**Queued:** [${song.name}](${song.url})` + "\n" +
                `**Duration:** ${song.formattedDuration || "Unavailable."}`)
            .setColor("PURPLE")
            .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${Util.cleanDurationFormat(queue.duration * 1000)}`)
            .setFooter("Elixir Music", client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
        await DatabaseUtil.addPlayedSong(1);
        queue.textChannel.send({embeds: [embed]}).then(() => {});
    }
});

player.on("initQueue", async queue => {
    queue.autoplay = false;
    queue.volume = 110;
});

/**
 * Emits when the client encounters an error.
 * @return void
 */

player.on("error", async (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] Error: ${error.message}`) ;
});

/**
 * Emits when the client is unable to connect to a voice channel.
 * @return void
 */

player.on("connectionError", async (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
});