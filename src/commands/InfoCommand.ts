import {ApplicationCommandData, Client, CommandInteraction} from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../Command";

export default class InfoCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("info", {
            name: "info",
            description: "View Elixir's information & statistics."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        return void await interaction.reply({
            embeds: [await EmbedUtil.getInformationEmbed(this.client)]
        });
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}