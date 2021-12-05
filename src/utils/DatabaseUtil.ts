import Stats from "../schemas/StatsSchema";
import {Collection} from "mongoose";

export default class DatabaseUtil {

    public static async initializeCollections(): Promise<void> {
        await Stats.create({
            commandsRan: 0,
            songsPlayed: 0,
            playlistsQueued: 0
        });
    }

    public static async addPlayedSong(amount: number): Promise<void> {
        const stats = await Stats.findOne();
        stats.songsPlayed += amount;
        await stats.save();
    }

    public static async addExecutedCommand(amount: number): Promise<void> {
        const stats = await Stats.findOne();
        stats.commandsRan += amount;
        await stats.save();
    }

    public static async addPlaylistPlayed(amount: number): Promise<void> {
        const stats = await Stats.findOne();
        stats.playlistsQueued += amount;
        await stats.save();
    }

    public static async getTotalCommandsExecuted(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.commandsRan as number;
    }

    public static async getTotalSongsPlayed(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.songsPlayed as number;
    }

    public static async getTotalPlaylistedQueued(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.playlistsQueued as number;
    }
}