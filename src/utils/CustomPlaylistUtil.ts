import CustomPlaylist from "../schemas/PlaylistSchema";
import {PlayerSearchResult, QueryType, Queue, Track} from "discord-player";
import {player} from "../Elixir";
import {CustomPlaylistObject} from "../types/CustomPlaylistObject";
import {ElixirStatus} from "../types/ElixirStatus";
import Logger from "../Logger";
import {User} from "discord.js";
import MusicPlayer from "./MusicPlayer";

export default class CustomPlaylistUtil {

    /**
     * Create a custom playlist by ID.
     * @param user The user who created this playlist.
     * @param id The playlist ID.
     * @return Promise<ElixirStatus> True if succeeded, false if failed.
     */

    public static async createCustomPlaylist(user: string, id: string): Promise<ElixirStatus> {
        return new Promise(async (resolve, reject) => {
            const result = await CustomPlaylist.findOne({playlistId: id});
            if (result) return reject({status: false});
            const data = await CustomPlaylist.create({
                userId: user,
                playlistId: id,
                tracks: []
            });
            await data.save();
            resolve({status: true});
        });
    }

    /**
     * Add a track to a custom playlist.
     * @param user The user who will add the track.
     * @param track The track to add.
     * @param id The playlist ID.
     * @param tracksToAdd The custom playlist object.
     * @return Promise<CustomPlaylistObject>
     */

    public static async addTrackToCustomPlaylist(user: string, track: string, id: string, tracksToAdd: CustomPlaylistObject): Promise<CustomPlaylistObject> {
        try {
            return new Promise(async (resolve, reject) => {
                const searchResult = await player.search(track, {requestedBy: user, searchEngine: QueryType.AUTO});
                if (!searchResult) reject({status: false});
                if (searchResult.playlist) {
                    reject({status: false});
                } else {
                    tracksToAdd.tracks.push(searchResult.tracks[0].url);
                    await CustomPlaylist.updateOne({playlistId: id, userId: user}, {tracks: tracksToAdd.tracks});
                    resolve({
                        status: true,
                        playlistId: id,
                        tracks: tracksToAdd.tracks
                    });
                }
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
                result.tracks.splice(track, 1);
                await CustomPlaylist.updateOne({playlistId: id, userId: user}, {tracks: result.tracks});
                resolve({
                    status: true,
                    playlistId: id,
                    tracks: result.tracks
                });
            });
        } catch {
            return new Promise(async (resolve, reject) => {
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
                        if (!result) reject(null);
                        return resolve({status: true, tracks: result.tracks});
                    })
                    .catch(async () => reject({status: false}));
            });
        } catch (error: any) {
            Logger.error(error);
            return new Promise(async (resolve, reject) => {
                reject({status: false});
            });
        }
    }

    /**
     * Play a custom playlist by ID.
     * @param queue The queue in which to add the playlist.
     * @param user The user who queued this custom playlist.
     * @param id The playlist ID.
     * @return Promise<CustomPlaylistObject>
     */

    public static async playCustomPlaylist(queue: Queue, user: User, id: string): Promise<CustomPlaylistObject> {
        try {
            const playlist: CustomPlaylistObject = await CustomPlaylistUtil.getCustomPlaylist(id);
            return new Promise(async (resolve, reject) => {
                if (!playlist) reject({status: false});
                MusicPlayer.sendQueuedMessage.set(queue.guild.id, false);
                resolve({status: true, tracks: playlist.tracks});
                for (const track of playlist.tracks) {
                    const searched: PlayerSearchResult = await player.search(track, {
                        requestedBy: user,
                        searchEngine: QueryType.AUTO
                    });
                    queue.addTrack(searched.tracks[0]);
                }
                MusicPlayer.sendQueuedMessage.set(queue.guild.id, true);
            });
        } catch (error: any) {
            return new Promise((resolve, reject) => {
                reject({status: false});
            });
        }
    }
}