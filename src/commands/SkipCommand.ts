import {Client} from "discord.js";
import {Command} from "../interfaces/Command";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";

export default class SkipCommand implements Command {

    public name: string = "skip";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Skip to the next song in the queue.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                DatabaseUtil.addExecutedCommand(1);
                const queue = player.getQueue(interaction.guild.id);
                const channel = interaction.member?.voice.channel;
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "There is no queue for the server.")]});
                }
                if (!channel) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel.")]});
                }
                if (queue.songs.length <= 1) {
                    await player.stop(queue)
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "default", "There were no more songs in the queue, so I left the voice channel.")]});
                }
                await player.skip(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "default", "Skipping to the next song...")]});
            } catch (error) {
                console.log(error);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "error", "An error occurred while running this command.")]});
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