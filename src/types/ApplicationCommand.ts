import {ApplicationCommandData, CommandInteraction} from "discord.js";

export interface ApplicationCommand {
    getName(): string,
    getCommandData(): ApplicationCommandData,
    execute(event: CommandInteraction): void
}