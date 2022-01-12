import {ApplicationCommandData, Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import {Queue} from "discord-player";
import MusicPlayer from "../utils/MusicPlayer";
import Utilities from "../utils/Utilities";
import Command from "../Command";

export default class PauseCommand extends Command {

    public name: string = "pause";
    public description: string = "Pause the current song.";
    private readonly client: Client;

    constructor(client: Client) {
        super("pause", {
            name: "pause",
            description: "Pause the current song."
        })
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member = interaction.member;
            if (member instanceof GuildMember) {
                if (!queue) {
                    const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                    return void await interaction.reply({embeds: [embed]});
                } else if (!member.voice.channel) {
                    const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return void await interaction.reply({embeds: [embed]});
                } else if (!MusicPlayer.isPlaying(queue)) {
                    const embed = EmbedUtil.getErrorEmbed("The track is already paused.");
                    return void await interaction.reply({embeds: [embed]});
                } else {
                    queue.setPaused(true);
                    MusicPlayer.setPlaying(queue, false);
                    const embed = EmbedUtil.getDefaultEmbed("Paused the current track successfully.");
                    return void await interaction.reply({embeds: [embed]});
                }
            } else {
                return void await interaction.reply({content: "This command must be run in a guild."});
            }
        } catch (error) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
            return void await interaction.reply({embeds: [embed]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}