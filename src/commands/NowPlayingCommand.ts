import * as Discord from "discord.js";
import {Client} from "discord.js";
import {player} from "../Elixir";
import {Command} from "../interfaces/Command";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";


export default class NowPlayingCommand implements Command {

    public name: string = "nowplaying";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View information about the song currently playing.";
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
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "There is no queue for the server.")]});
                }
                const track = queue.songs[0];
                const embed = new Discord.MessageEmbed()
                    .setDescription(`[${track.name}](https://open.spotify.com)`.substr(0, 256) + "\n" +
                    `**Artist:** [${track.uploader.name}](https://open.spotify.com)`)
                    .setColor("PURPLE")
                    .setFooter("ponjo.club/elixir", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                return await interaction.reply({embeds: [embed]});
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