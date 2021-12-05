import {Client} from "discord.js";
import {player} from "../Elixir";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";

export default class ResumeCommand implements ICommand {

    public name: string = "resume";
    public description: string = "Resume the current song.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There is no queue for the server.")]});
                }
                await player.resume(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Successfully resumed the current song.")]});
            } catch (error) {
                return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("The song is already playing.")]});
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