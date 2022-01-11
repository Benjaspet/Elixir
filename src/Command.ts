import {ApplicationCommand} from "./types/ApplicationCommand";
import {ApplicationCommandData, CommandInteraction} from "discord.js";

export default abstract class Command implements ApplicationCommand {

    protected name: string;
    protected data: ApplicationCommandData;

    protected constructor(name: string, data: ApplicationCommandData) {
        this.name = name;
        this.data = data;
    }

    abstract execute(event: CommandInteraction): Promise<void>;
    abstract getCommandData(): ApplicationCommandData;
    abstract getName(): string;

}