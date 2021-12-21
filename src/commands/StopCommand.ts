import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {Queue} from "discord-player";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import MusicPlayer from "../utils/MusicPlayer";

export default class StopCommand implements ICommand {

    public name: string = "stop";
    public description: string = "Stop the queue & remove Elixir from the voice channel.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const queue: Queue = player.getQueue(interaction.guild);
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    } else {
                        MusicPlayer.setPlaying(queue, false);
                        await queue.destroy(true);
                        const embed = EmbedUtil.getDefaultEmbed("Cleared the queue and left the voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    }
                } else {
                    return await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
                return await interaction.reply({embeds: [embed]});
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