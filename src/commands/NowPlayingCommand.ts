import {Client, CommandInteraction, GuildMember, MessageEmbed} from "discord.js";
import {player} from "../Elixir";
import {ICommand} from "../interfaces/ICommand";
import {Queue} from "discord-player";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import Vars from "../constants/Vars";
import Utilities from "../utils/Utilities";

export default class NowPlayingCommand implements ICommand {

    public name: string = "nowplaying";
    public description: string = "View information about the song currently playing.";
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
                    if (!queue || !queue.playing) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return void await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return void await interaction.reply({embeds: [embed]});
                    } else {
                        const divisor: number = queue.streamTime / queue.current.durationMS;
                        const percentage: string = divisor >= 100 ? "Completed" : Math.round((divisor * 100)).toString() + "%";
                        const embed = new MessageEmbed()
                            .setTitle("Currently Playing")
                            .setColor(Vars.DEFAULT_EMBED_COLOR)
                            .setDescription(`[${queue.current.title}](${queue.current.url})`)
                            .addField("Track Details", "" + "• Duration: " + queue.current.duration + "\n" +
                            "• Percent completed: " + percentage + "\n" + "• Artist: " + queue.current.author)
                            .setThumbnail(queue.current.thumbnail)
                            .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL({dynamic: false})})
                            .setTimestamp()
                        return void await interaction.reply({embeds: [embed]})
                    }
                } else {
                    return void await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                Utilities.sendWebhookMessage(error, true, interaction.guild.id);
                const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
                return void await interaction.reply({embeds: [embed]});
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