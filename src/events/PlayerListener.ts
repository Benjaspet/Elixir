import {player} from "../Elixir";
import Logger from "../Logger";
import EmbedUtil from "../utils/EmbedUtil";
import {PlayerError, Queue, StreamDispatcher, Track} from "discord-player";
import MusicPlayer from "../utils/MusicPlayer";
import DatabaseUtil from "../utils/DatabaseUtil";
import Utilities from "../utils/Utilities";

player.on("connectionCreate", (queue: Queue, connection: StreamDispatcher) => {
   MusicPlayer.addStream();
});

player.on("botDisconnect", queue => { });

player.on("trackEnd", (queue: Queue, track: Track) => { });

player.on("trackStart", (queue: Queue, track: Track) => { });

player.on("trackAdd", async (queue: Queue, track: Track) => {
   const metadata: any = queue.metadata;
   metadata.channel.send({
      embeds: [
          EmbedUtil.getDefaultEmbed(`**Queued:** [${track.title}](${track.url})`)
      ]
   });
   await DatabaseUtil.addPlayedSong(1);
});

player.on("tracksAdd", async (queue: Queue, tracks: Track[]) => {
   const metadata: any = queue.metadata; const title = tracks[0].playlist;
   const tracksHyperlink = title ? `[${tracks[0].playlist.title}](${tracks[0].playlist.url})` : "Custom Playlist";
   if (tracksHyperlink) {
      metadata.channel.send({
         embeds: [
            EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
         ]
      });
   }
   await DatabaseUtil.addPlaylistPlayed(1);
});

player.on("error", (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] Error: ${error.message}`);
   Utilities.sendWebhookMessage(error, true, queue.guild.id);
});

player.on("connectionError", (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
   Utilities.sendWebhookMessage(error, true, queue.guild.id);
});