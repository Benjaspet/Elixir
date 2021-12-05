import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";

export default class ShuffleCommand implements ICommand {

    public name: string = "shuffle";
    public description: string = "Shuffle the order of the songs in the queue.";
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
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You cannot shuffle the queue. There is one song.")]});
                }
                await player.shuffle(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Successfully shuffled the queue.")]});
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