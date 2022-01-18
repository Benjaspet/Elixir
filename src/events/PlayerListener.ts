/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {PlayerError, Playlist, Queue, Track} from "discord-player";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";

player.on("trackAdd", async (queue: Queue, track: Track) => {
   const metadata: any = queue.metadata;
   const title: string = track.title.length > 60 ? track.title.substring(0, 60) + "..." : track.title;
   metadata.channel.send({
      embeds: [
         EmbedUtil.getDefaultEmbed(`**Queued:** [${title}](${track.url}) (${track.duration})`)
      ]
   });
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
   } else {
      const tracksHyperlink = "a custom playlist";
      metadata.channel.send({
         embeds: [
            EmbedUtil.getDefaultEmbed(`Queued **${tracks.length}** tracks from ${tracksHyperlink}.`)
         ]
      });
   }
});

player.on("error", (queue: Queue, error: PlayerError) => {
   Logger.error(error.message);
});

player.on("connectionError", (queue: Queue, error: PlayerError) => {
   Logger.error(`[${queue.guild.name}] ConnectionError: ${error.message}`)
});