import {player} from "../Elixir";
import {Song} from "distube";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

player.on("addSong", async (queue, song) => {
   await queue.textChannel.send({
      embeds: [
         EmbedUtil.getDefaultEmbed(`**Queued:** [${song.name}](${song.url})`)
      ]
   });
   await DatabaseUtil.addPlayedSong(1);
});

player.on("addList", async (queue, playlist) => {
   const title: string = playlist.name; const tracks: Song[] = playlist.songs;
   const tracksHyperlink = title ? `[${tracks[0].playlist.name}](${tracks[0].playlist.url})` : "Custom Playlist";
   await queue.textChannel.send({
         embeds: [
            EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
         ]
      });
   await DatabaseUtil.addPlaylistPlayed(1);
});



// player.on("trackEnd", (queue: Queue, track: Track) => { });
//
// player.on("trackStart", (queue: Queue, track: Track) => { });
//
// player.on("error", (queue: Queue, error: PlayerError) => { });
//
// player.on("connectionError", (queue: Queue, error: PlayerError) => {
//    Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
//    Utilities.sendWebhookMessage(error, true, queue.guild.id);
// });