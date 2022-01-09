import CustomPlaylist from "../schemas/PlaylistSchema";
import {Snowflake} from "discord.js";
import {QueryType, Queue, Track} from "discord-player";
import Logger from "../Logger";
import {player} from "../Elixir";
import {CustomPlaylistObject} from "../types/CustomPlaylistObject";

export default class CustomPlaylistUtil {

    /**
     * Create a custom playlist by ID.
     * @param user The user who created this playlist.
     * @param id The playlist ID.
     * @return Promise<boolean> True if succeeded, false if failed.
     */

    public static async createCustomPlaylist(user: Snowflake, id: string): Promise<boolean> {
        return await new Promise(async () => {
            const result = await CustomPlaylist.findOne({id: id});
            if (result) return false;
            const data = await CustomPlaylist.create({
                userId: user,
                playlistId: id,
                tracks: []
            });
            await data.save();
        });
    }

    /**
     * Add a track to a custom playlist.
     * @param user The user who will add the track.
     * @param track The track to add.
     * @param id The playlist ID.
     * @return Promise<any>
     */

    public static async addTrackToCustomPlaylist(user: Snowflake, track: string, id: string): Promise<CustomPlaylistObject|null> {
        return await new Promise(async (resolve, reject) => {
            const result = await CustomPlaylist.findOne({id: id, userId: user});
            if (result) {
                const searchResult = await player.search(track, {requestedBy: user, searchEngine: QueryType.AUTO});
                if (!searchResult.playlist) {
                    return reject(null);
                } else {
                    const updated = result.tracks.push(searchResult.tracks[0]);
                    result.tracks = updated;
                    result.save();
                    await CustomPlaylist.updateOne({id: id}, {tracks: updated});
                    return resolve({
                        id: id,
                        tracks: updated
                    });
                }
            } else return reject(null);
        });
    }

    /**
     * Get a custom playlist's contents by ID.
     * @param id The playlist ID.
     * @return Promise<Track[]|null>
     */

    public static async getCustomPlaylist(id: string): Promise<Track[]|null> {
        try {
            const result = await CustomPlaylist.findOne({id: id});
            if (result) return <Track[]> result.tracks;
            return null;
        } catch (error: any) { Logger.error(error); }
    }

    /**
     * Play a custom playlist by ID.
     * @param queue The queue in which to add the playlist.
     * @param id The playlist ID.
     * @return Promise<void>
     */

    public static async playCustomPlaylist(queue: Queue, id: string): Promise<void> {
        try {
            const playlist: Track[] = await CustomPlaylistUtil.getCustomPlaylist(id);
            if (playlist) await queue.addTracks(playlist);
        } catch (error: any) { Logger.error(error); }
    }
}