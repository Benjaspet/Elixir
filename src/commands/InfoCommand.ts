import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";

export default class InfoCommand implements ICommand {

    public name: string = "info";
    public description: string = "View Elixir's information & statistics.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            return await interaction.reply({embeds: [await EmbedUtil.getInformationEmbed(this.client)]});
        }
    }

    public getSlashData(): object {
        return this.slashData;
    }

    public slashData: object = {
        name: this.name,
        description: this.description
    };
}