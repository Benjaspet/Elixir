import {PlayerError, Playlist, Queue, Track} from "discord-player";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";
import Logger from "../structs/Logger";
import Utilities from "../utils/Utilities";

player.on("trackEnd", (queue: Queue, track: Track) => { });

player.on("trackStart", (queue: Queue, track: Track) => { });

player.on("trackAdd", async (queue: Queue, track: Track) => {
   const metadata: any = queue.metadata;
   const title: string = track.title.length > 60 ? track.title.substring(0, 60) + "..." : track.title;
   metadata.channel.send({
      embeds: [
         EmbedUtil.getDefaultEmbed(`**Queued:** [${title}](${track.url}) (${track.duration})`)
      ]
   });
   await DatabaseUtil.addPlayedSong(1);
});

player.on("tracksAdd", async (queue: Queue, tracks: Track[]) => {
   const metadata: any = queue.metadata; const playlist: Playlist = tracks[0].playlist;
   if (playlist != null) {
      const tracksHyperlink = `[${tracks[0].playlist.title}](${tracks[0].playlist.url})`;
      metadata.channel.send({
         embeds: [
            EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
         ]
      });
      await DatabaseUtil.addPlaylistPlayed(1);
   } else {
      const tracksHyperlink = "a custom playlist";
      metadata.channel.send({
         embeds: [
            EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
         ]
      });
      await DatabaseUtil.addPlaylistPlayed(1);

   }
});

player.on("error", (queue: Queue, error: PlayerError) => {
   Logger.error(error.message);
   Utilities.sendWebhookMessage(error, true, queue.guild.id);
});

player.on("connectionError", (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
   Utilities.sendWebhookMessage(error, true, queue.guild.id);
});