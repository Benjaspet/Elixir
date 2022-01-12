import {ApplicationCommandData, Client, CommandInteraction, GuildMember, MessageEmbed} from "discord.js";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import Vars from "../constants/Vars";
import Utilities from "../utils/Utilities";
import Command from "../Command";
import {Queue, Song} from "distube";

export default class NowPlayingCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("nowplaying", {
            name: "nowplaying",
            description: "View information about the song currently playing."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member: any = interaction.member;
            if (member instanceof GuildMember) {
                if (!queue || !queue.playing) {
                    const embed: MessageEmbed = EmbedUtil.getErrorEmbed("There's no queue at the moment.");
                    return void await interaction.reply({embeds: [embed]});
                } else if (!member.voice.channel) {
                    const embed: MessageEmbed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return void await interaction.reply({embeds: [embed]});
                } else {
                    const divisor: number = queue.currentTime / queue.songs[0].duration;
                    const percentage: string = divisor >= 100 ? "Done." : Math.round((divisor * 100)).toString() + "%";
                    const current: Song = queue.songs[0];
                    const embed = new MessageEmbed()
                        .setTitle("Currently Playing")
                        .setColor(Vars.DEFAULT_EMBED_COLOR)
                        .setDescription(`[${current.name}](${current.url})`)
                        .addField("Track Details", "" + "• Duration: " + current.duration + "\n" +
                            "• Percent completed: " + percentage + "\n" + "• Artist: " + current.uploader.name + "\n" +
                            "• Requested by: " + current.user + "• Source: " + current.source)
                        .setThumbnail(current.thumbnail)
                        .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL()})
                        .setTimestamp()
                    return void await interaction.reply({embeds: [embed]})
                }
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
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