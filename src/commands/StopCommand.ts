import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";

export default class StopCommand implements ICommand {

    public name: string = "stop";
    public description: string = "Stop the queue & remove Elixir from the voice channel.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const queue = player.getQueue(interaction.guild.id);
                const channel = interaction.member?.voice.channel;
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There is no queue for the server.")]});
                }
                if (!channel) {
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel.")]});
                }
                await queue.stop();
                return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Stopped the queue & left the voice channel.")]});
            } catch (error) {
                Logger.error(error);
                return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("An error occurred while running this command.")]});
            }
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