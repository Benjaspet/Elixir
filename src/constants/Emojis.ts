import Config from "../structs/Config";

export default class Emojis {

    public static SUCCESS = Config.get("EMOJI-SUCCESS");
    public static ERROR = Config.get("EMOJI-ERROR");
    public static LOADING = Config.get("EMOJI-LOADING");
    public static SERVERS = Config.get("EMOJI-SERVERS")
    public static DEVELOPER = Config.get("EMOJI-DEVELOPER")
    public static USERS = Config.get("EMOJI-USERS");
    public static WEBSOCKET = Config.get("EMOJI-WEBSOCKET");
    public static UPTIME = Config.get("EMOJI-UPTIME");
    public static LIBRARIES = Config.get("EMOJI-LIBRARIES");
    public static SONGS = Config.get("EMOJI-SONGS");
    public static COMMANDS = Config.get("EMOJI-COMMANDS");
    public static PLAYLISTS = Config.get("EMOJI-PLAYLISTS");
    public static CREATOR = Config.get("EMOJI-CREATOR");

}