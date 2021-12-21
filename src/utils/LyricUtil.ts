import {Lyrics} from "@discord-player/extractor";
import Config from "../Config";

export default class LyricUtil {

    public static base = Lyrics.init(Config.get("GENIUS-API-KEY"));

}