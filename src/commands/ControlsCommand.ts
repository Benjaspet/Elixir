import {ApplicationCommandData, Client, CommandInteraction} from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../Command";

export default class ControlsCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("controls", {
            name: "controls",
            description: "Access Elixir's control panel."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            return void await interaction.reply({
                embeds: [EmbedUtil.getControlPanelEmbed(this.client)],
                components: [EmbedUtil.getControlPanelButtons()]
            });
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}