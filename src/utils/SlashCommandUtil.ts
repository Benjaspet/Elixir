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
import PlayCommand from "../commands/PlayCommand";
import LoopCommand from "../commands/LoopCommand";
import SearchCommand from "../commands/SearchCommand";
import LyricsCommand from "../commands/LyricsCommand";
import ControlsCommand from "../commands/ControlsCommand";

export default class SlashCommandUtil {

    public static slashCommandTypeToInt(type: string): number {
        const types = {
            "SUB_COMMAND": 1,
            "SUB_COMMAND_GROUP": 2,
            "STRING": 3,
            "INTEGER": 4,
            "BOOLEAN": 5,
            "USER": 6,
            "CHANNEL": 7,
            "ROLE": 8,
            "MENTIONABLE": 9,
            "NUMBER": 10
        }
        return types[type];
    }

    public static getAllSlashCommandData(client: Client): object[] {
        return [
            new ControlsCommand(client).getSlashData(),
            new InfoCommand(client).getSlashData(),
            new HelpCommand(client).getSlashData(),
            new JoinCommand(client).getSlashData(),
            new NowPlayingCommand(client).getSlashData(),
            new PauseCommand(client).getSlashData(),
            new QueueCommand(client).getSlashData(),
            new ResumeCommand(client).getSlashData(),
            new SearchCommand(client).getSlashData(),
            new ShuffleCommand(client).getSlashData(),
            new SkipCommand(client).getSlashData(),
            new StopCommand(client).getSlashData(),
            new VolumeCommand(client).getSlashData(),
            new PlayCommand(client).getSlashData(),
            new LoopCommand(client).getSlashData(),
            new LyricsCommand(client).getSlashData()
        ];
    }
}