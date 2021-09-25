import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";

export default class InfoCommand implements PonjoCommand {

    public name: string = "info";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View Elixir's information & statistics.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
        DatabaseUtil.addExecutedCommand(1);
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            DatabaseUtil.addExecutedCommand(1);
            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "info")]});
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