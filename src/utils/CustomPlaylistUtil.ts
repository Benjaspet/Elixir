import CustomPlaylist from "../schemas/PlaylistSchema";
import {Snowflake} from "discord.js";
import {QueryType, Queue, Track} from "discord-player";
import Logger from "../Logger";
import {player} from "../Elixir";

export default class CustomPlaylistUtil {

    public static async createCustomPlaylist(user: Snowflake, id: string): Promise<void> {
        const result = await CustomPlaylist.findOne({id: id});
        if (result) {
            return;
        } else {
            const data = await CustomPlaylist.create({
                userId: user,
                playlistId: id,
                tracks: []
            });
            await data.save();
        }
    }

    public static async addTrackToCustomPlaylist(user: Snowflake, track: Track, id: string): Promise<any> {
        const result = await CustomPlaylist.findOne({id: id, userId: user});
        if (result) {
            const query = await CustomPlaylist.findOne({id: id});
            const searchResult = await player.search(track, {requestedBy: user, searchEngine: QueryType.AUTO});
            if (searchResult.playlist) {
                return;
            } else {
                const updated = query.tracks.push(searchResult.tracks[0]);
                query.tracks = updated; query.save();
                await CustomPlaylist.updateOne({id: id}, {tracks: updated});
            }
        } else { return; }
    }

    public static async getCustomPlaylist(id: string): Promise<any> {
        try {
            const result = await CustomPlaylist.findOne({id: id});
            if (result) return <Track[]> result.tracks;
        } catch (error: any) { Logger.error(error); }
    }

    public static async playCustomPlaylist(queue: Queue, id: string) {
        try {
            const playlist: Track[] = await CustomPlaylistUtil.getCustomPlaylist(id);
            if (playlist) {
                await queue.addTracks(playlist);
            }
        } catch (error: any) { Logger.error(error); }
    }
}