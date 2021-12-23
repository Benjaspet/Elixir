import {Snowflake} from "discord.js";
import Stats from "../schemas/StatsSchema";
import DJRole from "../schemas/DJSchema";

export default class DatabaseUtil {

    /**
     * Fetch the DJ role for a specific guild, if any.
     * @param guild: Snowflake
     * @return Promise<any>
     */

    public static async getDJRole(guild: Snowflake): Promise<any> {
        return void await new Promise(async(resolve, reject) => {
           try {
               const result = await DJRole.findOne({guildId: guild});
               resolve({
                   guild: result.guildId,
                   role: result.roleId
               });
           } catch (error: any) {
               reject({
                   msg: "An error ocurred."
               });
           }
        });
    }

    /**
     * Set the DJ role for a specific guild.
     * @param guild
     * @param role
     */

    public static async setDJRole(guild: Snowflake, role: Snowflake): Promise<any> {
        return await new Promise(async(resolve, reject) => {
            try {
                const result = await DJRole.findOneAndUpdate({guild: guild}, {roleId: role});
                resolve({
                    guild: result.guildId,
                    role: result.roleId
                });
            } catch (error: any) {
                reject({
                    msg: "An error ocurred."
                });
            }
        });
    }

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