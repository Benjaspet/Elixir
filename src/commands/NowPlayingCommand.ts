import {Client, MessageEmbed} from "discord.js";
import {player} from "../Elixir";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";

export default class NowPlayingCommand implements ICommand {

    public name: string = "nowplaying";
    public description: string = "View information about the song currently playing.";
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
                const track = queue.songs[0];
                const embed = new MessageEmbed()
                    .setDescription(`[${track.name}](https://open.spotify.com)`.substr(0, 256) + "\n" +
                    `**Artist:** [${track.uploader.name}](https://open.spotify.com)`)
                    .setColor("PURPLE")
                    .setFooter("Elixir Music", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                return await interaction.reply({embeds: [embed]});
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