import {player} from "../Elixir";
import Logger from "../Logger";
import EmbedUtil from "../utils/EmbedUtil";
import {PlayerError, Queue, Track} from "discord-player";
import MusicPlayer from "../utils/MusicPlayer";

player.on("botDisconnect", async queue => {
   MusicPlayer.setPlaying(queue, false);
   queue.stop();
});

player.on("trackEnd", async (queue: Queue, track: Track) => { });

player.on("trackStart", async (queue: Queue, track: Track) => { });

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

player.on("error", async (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] Error: ${error.message}`) ;
});

player.on("connectionError", async (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
});