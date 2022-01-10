import Stats from "../schemas/StatsSchema";

export default class DatabaseUtil {

    /**
     * Initialize the bot statistic database.
     * @return Promise<void>
     */

    public static async initializeCollections(): Promise<void> {
        await Stats.create({
            commandsRan: 0,
            songsPlayed: 0,
            playlistsQueued: 0
        });
    }

    /**
     * Add a played song to the database.
     * @param amount The amount of songs to add.
     * @return Promise<void>
     */

    public static async addPlayedSong(amount: number): Promise<void> {
        const stats = await Stats.findOne();
        stats.songsPlayed += amount;
        await stats.save();
    }

    /**
     * Add an executed command to the database.
     * @param amount The amount of commands to add.
     * @return Promise<void>
     */

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

    public static async getTotalPlaylistsQueued(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.playlistsQueued as number;
    }
}