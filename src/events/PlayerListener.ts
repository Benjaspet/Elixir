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

player.on("botDisconnect", async queue => {
   MusicPlayer.setPlaying(queue, false);
   MusicPlayer.removeStream();
   queue.stop();
});

player.on("trackEnd", async (queue: Queue, track: Track) => { });

player.on("trackStart", async (queue: Queue, track: Track) => {
   await DatabaseUtil.addPlayedSong(1);
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
   const tracksHyperlink = `[${tracks[0].playlist.title}](${tracks[0].playlist.url})` || "Custom Playlist";
   if (tracksHyperlink) {
      metadata.channel.send({
         embeds: [
            EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
         ]
      });
   }
   await DatabaseUtil.addPlaylistPlayed(1);
});

player.on("error", async (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] Error: ${error.message}`);
   Utilities.sendWebhookMessage(error, true, queue.guild.id);
});

player.on("connectionError", async (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
   Utilities.sendWebhookMessage(error, true, queue.guild.id);
});