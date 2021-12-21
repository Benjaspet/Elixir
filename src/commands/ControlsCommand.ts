import {Client, CommandInteraction} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";

export default class ControlsCommand implements ICommand {

    public name: string = "controls";
    public description: string = "Access Elixir's control panel.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            return await interaction.reply({
                embeds: [EmbedUtil.getControlPanelEmbed(this.client)],
                components: [EmbedUtil.getControlPanelButtons()]
            });
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