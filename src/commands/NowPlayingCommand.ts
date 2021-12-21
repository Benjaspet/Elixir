import {Client, CommandInteraction, GuildMember, MessageEmbed} from "discord.js";
import {player} from "../Elixir";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import {Queue} from "discord-player";
import Vars from "../constants/Vars";

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
                        return await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    } else {
                        const progress = queue.createProgressBar({timecodes: true, length: 8});
                        const embed = new MessageEmbed()
                            .setTitle("Currently Playing")
                            .setColor(Vars.DEFAULT_EMBED_COLOR)
                            .setDescription(`[${queue.current.title}](${queue.current.url})` + "\n\n" + progress.replace(/ 0:00/g, " ◉ LIVE"))
                            .setThumbnail(queue.current.thumbnail)
                            .setFooter("Elixir Music", this.client.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                        return await interaction.reply({embeds: [embed]})
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