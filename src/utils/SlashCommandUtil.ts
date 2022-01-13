import {Client} from "discord.js";
import InfoCommand from "../commands/InfoCommand";
import HelpCommand from "../commands/HelpCommand";
import JoinCommand from "../commands/JoinCommand";
import NowPlayingCommand from "../commands/NowPlayingCommand";
import PauseCommand from "../commands/PauseCommand";
import QueueCommand from "../commands/QueueCommand";
import ResumeCommand from "../commands/ResumeCommand";
import ShuffleCommand from "../commands/ShuffleCommand";
import SkipCommand from "../commands/SkipCommand";
import StopCommand from "../commands/StopCommand";
import VolumeCommand from "../commands/VolumeCommand";
import LoopCommand from "../commands/LoopCommand";
import SearchCommand from "../commands/SearchCommand";
import LyricsCommand from "../commands/LyricsCommand";
import ControlsCommand from "../commands/ControlsCommand";
import PlaylistCommand from "../commands/PlaylistCommand";

export default class SlashCommandUtil {

    public static getAllSlashCommandData(client: Client): object[] {
        return [
            new ControlsCommand(client).getCommandData(),
            new HelpCommand(client).getCommandData(),
            new InfoCommand(client).getCommandData(),
            new JoinCommand(client).getCommandData(),
            new LoopCommand(client).getCommandData(),
            new LyricsCommand(client).getCommandData(),
            new NowPlayingCommand(client).getCommandData(),
            new PauseCommand(client).getCommandData(),
            new PlaylistCommand(client).getCommandData(),
            new QueueCommand(client).getCommandData(),
            new ResumeCommand(client).getCommandData(),
            new SearchCommand(client).getCommandData(),
            new ShuffleCommand(client).getCommandData(),
            new SkipCommand(client).getCommandData(),
            new StopCommand(client).getCommandData(),
            new VolumeCommand(client).getCommandData()
        ];
    }
}