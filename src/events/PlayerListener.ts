import {client, player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import * as Discord from "discord.js";
import PlayCommand from "../commands/PlayCommand";
import {MessageEmbed} from "discord.js";
import Util from "../utils/Util";
import Logger from "../Logger";
import EmbedUtil from "../utils/EmbedUtil";
import {PlayerError, Queue, Track} from "discord-player";

// player.on("addList", async (queue, playlist) => {
//     await DatabaseUtil.addPlaylistPlayed(1);
//     const embed = new Discord.MessageEmbed()
//         .setColor("PURPLE")
//         .setDescription("[Playlist queued successfully.](" + playlist.url + ")")
//         .setFooter(`Elixir Music`, client.user.displayAvatarURL({dynamic: true}))
//         .setTimestamp()
//     queue.textChannel.send({embeds: [embed]}).then(() => {});
// });
//
// player.on("addSong", async (queue, song) => {
//     if (PlayCommand.followUp.get(queue.textChannel.guild.id) == true) {
//         const embed = new MessageEmbed()
//             .setThumbnail(song.thumbnail)
//             .setDescription(`` +
//                 `**Queued:** [${song.name}](${song.url})` + "\n" +
//                 `**Duration:** ${song.formattedDuration || "Unavailable."}`)
//             .setColor("PURPLE")
//             .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${Util.cleanDurationFormat(queue.duration * 1000)}`)
//             .setFooter("Elixir Music", client.user.displayAvatarURL({dynamic: true}))
//             .setTimestamp()
//         await DatabaseUtil.addPlayedSong(1);
//         queue.textChannel.send({embeds: [embed]}).then(() => {});
//     }
// });
//
// player.on("initQueue", async queue => {
//     queue.autoplay = false;
//     queue.volume = 110;
// });

player.on("trackEnd", async (queue: Queue, track: Track) => {

});

player.on("trackStart", async (queue: Queue, track: Track) => {

});

player.on("trackAdd", async (queue: Queue, track: Track) => {
   const metadata: any = queue.metadata;
   metadata.channel.send({
      embeds: [
          EmbedUtil.getDefaultEmbed(`**Queued:** [${track.title}](${track.url})`)
      ]
   });
});

player.on("tracksAdd", async (queue: Queue, tracks: Track[]) => {
   const metadata: any = queue.metadata;
   const tracksHyperlink = `[${tracks[0].playlist.title}](${tracks[0].playlist.url})`;
   metadata.channel.send({
      embeds: [
          EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
      ]
   });
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