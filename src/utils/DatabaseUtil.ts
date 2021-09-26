import SqLite3 from "../resources/SqLite3";

export default class DatabaseUtil {

    public static getSqlQuery(index: number): string {
        const queries = [
            "CREATE TABLE IF NOT EXISTS statistics(version MESSAGE_TEXT NOT NULL PRIMARY KEY, commandsExecuted INTEGER NOT NULL, songsPlayed INTEGER NOT NULL, playlistsPlayed INTEGER NOT NULL)"
        ];
        return queries[index];
    }

    public static addExecutedCommand(amount: number): void {
        const currentCommands = this.getTotalCommandsExecuted();
        const currentSongs = this.getTotalSongsPlayed();
        const currentPlaylists = this.getTotalPlaylistsPlayed();
        SqLite3.master.prepare("INSERT OR REPLACE INTO statistics (version, commandsExecuted, songsPlayed, playlistsPlayed) VALUES (?, ?, ?, ?)").run("v3", currentCommands + amount, currentSongs, currentPlaylists);
    }

    public static addPlayedSong(amount: number): void {
        const currentCommands = this.getTotalCommandsExecuted();
        const currentSongs = this.getTotalSongsPlayed();
        const currentPlaylists = this.getTotalPlaylistsPlayed();
        SqLite3.master.prepare("INSERT OR REPLACE INTO statistics (version, commandsExecuted, songsPlayed, playlistsPlayed) VALUES (?, ?, ?, ?)").run("v3", currentCommands, currentSongs + amount, currentPlaylists);
    }

    public static addPlaylistPlayed(amount: number): void {
        const currentCommands = this.getTotalCommandsExecuted();
        const currentSongs = this.getTotalSongsPlayed();
        const currentPlaylists = this.getTotalPlaylistsPlayed();
        SqLite3.master.prepare("INSERT OR REPLACE INTO statistics (version, commandsExecuted, songsPlayed, playlistsPlayed) VALUES (?, ?, ?, ?)").run("v3", currentCommands, currentSongs, currentPlaylists + amount);
    }

    public static getTotalCommandsExecuted(): number {
        const total = SqLite3.master.prepare("SELECT commandsExecuted FROM statistics WHERE version=?").get("v3");
        return total.commandsExecuted;
    }

    public static getTotalSongsPlayed(): number {
        const total = SqLite3.master.prepare("SELECT songsPlayed FROM statistics WHERE version=?").get("v3");
        return total.songsPlayed;
    }

    public static getTotalPlaylistsPlayed(): number {
        const total = SqLite3.master.prepare("SELECT playlistsPlayed FROM statistics WHERE version=?").get("v3");
        return total.playlistsPlayed;
    }
}