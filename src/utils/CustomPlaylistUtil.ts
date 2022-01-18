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

import {QueryType, Queue, Track} from "discord-player";
import {player} from "../Elixir";
import {StageChannel, VoiceChannel} from "discord.js";
import {CustomPlaylistObject} from "../types/CustomPlaylistObject";
import {ElixirStatus} from "../types/ElixirStatus";
import CustomPlaylist from "../schemas/PlaylistSchema";
import Logger from "../structs/Logger";
import EmbedUtil from "./EmbedUtil";

export default class CustomPlaylistUtil {

    /**
     * Create a custom playlist by ID.
     * @param user The user who created this playlist.
     * @param id The playlist ID.
     * @return Promise<ElixirStatus> True if succeeded, false if failed.
     */

    public static async createCustomPlaylist(user: string, id: string): Promise<ElixirStatus> {
        try {
            return new Promise(async(resolve, reject) => {
                await CustomPlaylist.findOne({playlistId: id})
                    .then(async result => {
                        if (result) reject({status: false});
                        const data = await CustomPlaylist.create({
                            userId: user,
                            playlistId: id,
                            tracks: []
                        });
                        await data.save();
                        resolve({status: true});
                    });
            });
        } catch {
            return new Promise((resolve, reject) => {
                reject({status: false});
            });
        }
    }

    /**
     * Add a track to a custom playlist.
     * @param user The user who will add the track.
     * @param track The track to add.
     * @param id The playlist ID.
     * @param obj The custom playlist object.
     * @return Promise<CustomPlaylistObject>
     */

    public static async addTrackToCustomPlaylist(user: string, track: string, id: string, obj: CustomPlaylistObject): Promise<CustomPlaylistObject> {
        try {
            return new Promise(async(resolve, reject) => {
                const searchResult = await player.search(track, {requestedBy: user, searchEngine: QueryType.AUTO});
                if (!searchResult) reject({status: false});
                if (searchResult.playlist) reject({status: false});
                obj.tracks.push(searchResult.tracks[0]);
                await CustomPlaylist.updateOne({playlistId: id, userId: user}, {tracks: obj.tracks});
                resolve({
                    status: true,
                    playlistId: id,
                    tracks: obj.tracks
                });
            });
        } catch {
            return new Promise(async (resolve, reject) => {
                reject({status: false});
            });
        }
    }

    /**
     * Remove a track from a custom playlist.
     * @param user The ID of the user that removed this track.
     * @param track The position of the track to remove.
     * @param id The ID of the playlist the track is in.
     * @return Promise<CustomPlaylistObject>
     */

    public static async removeTrackFromCustomPlaylist(user: string, track: number, id: string): Promise<CustomPlaylistObject> {
        try {
            return new Promise(async (resolve, reject) => {
                const result = await CustomPlaylistUtil.getCustomPlaylist(id);
                if (!result) reject({status: false});
                if (result.tracks.length < 1 && track != 1) reject({status: false});
                result.tracks.splice(track - 1, 1);
                await CustomPlaylist.updateOne({playlistId: id, userId: user}, {tracks: result.tracks});
                resolve({
                    status: true,
                    playlistId: id,
                    tracks: result.tracks
                });
            });
        } catch {
            return new Promise((resolve, reject) => {
                reject({status: false});
            });
        }
    }

    /**
     * Get a custom playlist's contents by ID.
     * @param id The playlist ID.
     * @return Promise<CustomPlaylistObject>
     */

    public static async getCustomPlaylist(id: string): Promise<CustomPlaylistObject> {
        try {
            return new Promise(async (resolve, reject) => {
                await CustomPlaylist.findOne({playlistId: id})
                    .then(async result => {
                        if (!result) reject({status: false});
                        resolve({status: true, tracks: result.tracks});
                    })
                    .catch(() => {
                        reject({status: false});
                    });
            });
        } catch (error: any) {
            Logger.error(error);
            return new Promise((resolve, reject) => {
                reject({status: false});
            });
        }
    }

    /**
     * Play a custom playlist by ID.
     * @param queue The queue in which to add the playlist.
     * @param id The playlist ID.
     * @param channel The voice channel to join.
     * @return Promise<CustomPlaylistObject>
     */

    public static async playCustomPlaylist(queue: Queue, id: string, channel: VoiceChannel|StageChannel): Promise<CustomPlaylistObject> {
        try {
            return new Promise(async(resolve, reject) => {
                await CustomPlaylistUtil.getCustomPlaylist(id)
                    .then(async result => {
                        if (!result) return reject({status: false});
                        if (!result || result.tracks.length == 0) {
                            const metadata: any = queue.metadata;
                            const embed = EmbedUtil.getErrorEmbed("Unable to join your voice channel.");
                            metadata.channel.send({embeds: [embed]});
                            return reject({status: false});
                        }
                        let track: Track; let tracks: Track[] = [];
                        for (let i = 0; i < result.tracks.length; i++) {
                            track = new Track(player, {
                                title: result.tracks[i].title,
                                description: result.tracks[i].description,
                                author: result.tracks[i].author,
                                url: result.tracks[i].url,
                                thumbnail: result.tracks[i].thumbnail,
                                duration: result.tracks[i].duration,
                                views: result.tracks[i].views,
                                requestedBy: result.tracks[i].requestedBy,
                                playlist: result.tracks[i].playlist,
                                source: result.tracks[i].source,
                                raw: result.tracks[i].raw
                            });
                            tracks.push(track);
                        }
                        queue.addTracks(tracks);
                        resolve({status: true});
                    })
                    .catch((error) => {console.log(error); reject({status: false})});
            });
        } catch (error: any) {
            return new Promise((resolve, reject) => {
                reject({status: false});
            });
        }
    }
}