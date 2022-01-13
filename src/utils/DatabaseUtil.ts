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

    /**
     * Add an amount to the total count of played playlists.
     * @param amount
     * @return Promise<void>
     */

    public static async addPlaylistPlayed(amount: number): Promise<void> {
        const stats = await Stats.findOne();
        stats.playlistsQueued += amount;
        await stats.save();
    }

    /**
     * Get the total amount of commands executed.
     * @return Promise<number>
     */

    public static async getTotalCommandsExecuted(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.commandsRan as number;
    }

    /**
     * Get the total amount of songs played.
     * @return Promise<number>
     */

    public static async getTotalSongsPlayed(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.songsPlayed as number;
    }

    /**
     * Get the total amount of playlists queued.
     * @return Promise<number>
     */

    public static async getTotalPlaylistsQueued(): Promise<number> {
        const stats = await Stats.findOne();
        return stats.playlistsQueued as number;
    }
}