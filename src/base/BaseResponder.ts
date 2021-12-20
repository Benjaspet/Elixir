import {Client, CommandInteraction, Interaction} from "discord.js";
import FilterCommand from "../commands/FilterCommand";
import HelpCommand from "../commands/HelpCommand";
import InfoCommand from "../commands/InfoCommand";
import JoinCommand from "../commands/JoinCommand";
import LoopCommand from "../commands/LoopCommand";
import NowPlayingCommand from "../commands/NowPlayingCommand";
import PauseCommand from "../commands/PauseCommand";
import PlayCommand from "../commands/PlayCommand";
import QueueCommand from "../commands/QueueCommand";
import ResumeCommand from "../commands/ResumeCommand";
import SearchCommand from "../commands/SearchCommand";
import ShuffleCommand from "../commands/ShuffleCommand";
import SkipCommand from "../commands/SkipCommand";
import StopCommand from "../commands/StopCommand";
import VolumeCommand from "../commands/VolumeCommand";

export default class BaseResponder {

    public static async respondToApplicationCommands(client: Client, interaction: CommandInteraction): Promise<void> {
        new FilterCommand(client).execute(interaction).then(() => {});
        new HelpCommand(client).execute(interaction).then(() => {});
        new InfoCommand(client).execute(interaction).then(() => {});
        new JoinCommand(client).execute(interaction).then(() => {});
        new LoopCommand(client).execute(interaction).then(() => {});
        new NowPlayingCommand(client).execute(interaction).then(() => {});
        new PauseCommand(client).execute(interaction).then(() => {});
        new PlayCommand(client).execute(interaction).then(() => {});
        new QueueCommand(client).execute(interaction).then(() => {});
        new ResumeCommand(client).execute(interaction).then(() => {});
        new SearchCommand(client).execute(interaction).then(() => {});
        new ShuffleCommand(client).execute(interaction).then(() => {});
        new SkipCommand(client).execute(interaction).then(() => {});
        new StopCommand(client).execute(interaction).then(() => {});
        new VolumeCommand(client).execute(interaction).then(() => {});
    }
}