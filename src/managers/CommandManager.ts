import {Client, Collection} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import ControlsCommand from "../commands/ControlsCommand";
import HelpCommand from "../commands/HelpCommand";
import InfoCommand from "../commands/InfoCommand";
import JoinCommand from "../commands/JoinCommand";
import LoopCommand from "../commands/LoopCommand";
import LyricsCommand from "../commands/LyricsCommand";
import NowPlayingCommand from "../commands/NowPlayingCommand";
import PauseCommand from "../commands/PauseCommand";
import PlayCommand from "../commands/PlayCommand";
import PlaylistCommand from "../commands/PlaylistCommand";
import QueueCommand from "../commands/QueueCommand";
import ResumeCommand from "../commands/ResumeCommand";

export default class CommandManager {

    public static commands: Collection<string, ApplicationCommand> = new Collection<string, ApplicationCommand>();
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.initCommands();
    }

    private initCommands(): void {
        CommandManager.commands.set(new ControlsCommand(this.client).getName(), new ControlsCommand(this.client));
        CommandManager.commands.set(new HelpCommand(this.client).getName(), new HelpCommand(this.client));
        CommandManager.commands.set(new InfoCommand(this.client).getName(), new InfoCommand(this.client));
        CommandManager.commands.set(new JoinCommand(this.client).getName(), new JoinCommand(this.client));
        CommandManager.commands.set(new LoopCommand(this.client).getName(), new LoopCommand(this.client));
        CommandManager.commands.set(new LyricsCommand(this.client).getName(), new LyricsCommand(this.client));
        CommandManager.commands.set(new NowPlayingCommand(this.client).getName(), new NowPlayingCommand(this.client));
        CommandManager.commands.set(new PauseCommand(this.client).getName(), new PauseCommand(this.client));
        CommandManager.commands.set(new PlayCommand(this.client).getName(), new PlayCommand(this.client));
        CommandManager.commands.set(new PlaylistCommand(this.client).getName(), new PlaylistCommand(this.client));
        CommandManager.commands.set(new QueueCommand(this.client).getName(), new QueueCommand(this.client));
        CommandManager.commands.set(new ResumeCommand(this.client).getName(), new ResumeCommand(this.client));
    }
}