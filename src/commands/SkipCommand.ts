import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";

export default class SkipCommand implements ICommand {

    public name: string = "skip";
    public description: string = "Skip to the next song in the queue.";
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
                if (queue.songs.length <= 1) {
                    await player.stop(queue)
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There were no more songs in the queue, so I left the voice channel.")]});
                }
                await player.skip(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Skipping to the next song...")]});
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