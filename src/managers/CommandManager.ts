import {Client, Collection} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import ControlsCommand from "../commands/ControlsCommand";
import HelpCommand from "../commands/HelpCommand";

export default class CommandManager {

    public static commands: Collection<string, ApplicationCommand>;
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.initCommands();
    }

    private initCommands(): void {
        CommandManager.commands.set(new ControlsCommand(this.client).getName(), new ControlsCommand(this.client));
        CommandManager.commands.set(new HelpCommand(this.client).getName(), new HelpCommand(this.client));
    }
}