import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandData, CommandInteraction} from "discord.js";

export default abstract class Command implements ApplicationCommand {

    protected name: string;
    protected data: ApplicationCommandData;

    protected constructor(name: string, data: ApplicationCommandData) {
        this.name = name;
        this.data = data;
    }

    /**
     * Run the slash command.
     * @param event The CommandInteraction object.
     * @return Promise<void>
     */

    abstract execute(event: CommandInteraction): Promise<void>;

    /**
     * Get the slash command data for this command.
     * @return ApplicationCommandData
     */

    abstract getCommandData(): ApplicationCommandData;

    /**
     * The name of this command.
     * @return string
     */

    abstract getName(): string;

}