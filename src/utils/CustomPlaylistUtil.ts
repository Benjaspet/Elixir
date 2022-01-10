import CustomPlaylist from "../schemas/PlaylistSchema";
import {QueryType, Queue, Track} from "discord-player";
import Logger from "../Logger";
import {player} from "../Elixir";
import {CustomPlaylistObject} from "../types/CustomPlaylistObject";
import {ElixirStatus} from "../types/ElixirStatus";

export default class CustomPlaylistUtil {

    /**
     * Create a custom playlist by ID.
     * @param user The user who created this playlist.
     * @param id The playlist ID.
     * @return Promise<ElixirStatus> True if succeeded, false if failed.
     */

    public static async createCustomPlaylist(user: string, id: string): Promise<ElixirStatus> {

        return await new Promise(async (resolve, reject) => {
            const result = await CustomPlaylist.findOne({playlistId: id});
            if (result) return reject({status: false});
            const data = await CustomPlaylist.create({
                userId: user,
                playlistId: id,
                tracks: []
            });
            await data.save();
            return resolve({status: true});
        });
    }

    /**
     * Add a track to a custom playlist.
     * @param user The user who will add the track.
     * @param track The track to add.
     * @param id The playlist ID.
     * @return Promise<any>
     */

    public static async addTrackToCustomPlaylist(user: string, track: string, id: string): Promise<CustomPlaylistObject|null> {
        return await new Promise(async (resolve, reject) => {
            const result = await CustomPlaylist.findOne({playlistId: id, userId: user});
            if (result) {
                const searchResult = await player.search(track, {requestedBy: user, searchEngine: QueryType.AUTO});
                if (!searchResult) {
                    return reject(null);
                } else {
                    result.tracks.push(searchResult.tracks[0].url);
                    await CustomPlaylist.updateOne({playlistId: id, userId: user}, {tracks: result.tracks});
                    return resolve({
                        playlistId: id,
                        tracks: result.tracks
                    });
                }
            } else return reject(null);
        });
    }

    /**
     * Get a custom playlist's contents by ID.
     * @param id The playlist ID.
     * @return Promise<string[]|null>
     */

    public static async getCustomPlaylist(id: string): Promise<string[]|null> {
        try {
            const result = await CustomPlaylist.findOne({playlistId: id});
            return new Promise(async (resolve, reject) => {
               if (!result) return reject(null);
               return resolve(result.tracks);
            });
        } catch (error: any) {
            Logger.error(error);
            return new Promise(async (resolve, reject) => {
                return reject(null);
            });
        }
    }

    /**
     * Play a custom playlist by ID.
     * @param queue The queue in which to add the playlist.
     * @param id The playlist ID.
     * @return Promise<void>
     */

    public static async playCustomPlaylist(queue: Queue, id: string): Promise<void> {
        try {
            const playlist: string[] = await CustomPlaylistUtil.getCustomPlaylist(id);
            return new Promise(async (resolve, reject) => {
                if (!playlist) {
                    return reject();
                } else {
                    let tracks: Track[] = [];
                    for (const track of playlist) {
                        const searched = await player.search(track, {requestedBy: undefined, searchEngine: QueryType.AUTO});
                        tracks.push(searched.tracks[0]);
                    }
                    await queue.addTracks(tracks);
                    resolve();
                }
            });
        } catch (error: any) {
            return new Promise((resolve, reject) => {
                reject();
            })
        }
    }
}