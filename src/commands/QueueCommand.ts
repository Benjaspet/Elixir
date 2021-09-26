import * as Discord from "discord.js";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";

export default class QueueCommand implements PonjoCommand {

    public name: string = "queue";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View all songs in the queue.";
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
                if (queue.songs.length > 20) {
                    const embed = new Discord.MessageEmbed()
                        .setColor("PURPLE")
                        .setDescription("**Total songs:** " + queue.songs.length + "\n" + "**Duration:** " + queue.formattedDuration)
                    return await interaction.reply({embeds: [embed]});
                }
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Queue for ${interaction.guild.name}`)
                    .setColor("PURPLE")
                    .setFooter(`ponjo.club/elixir`, this.client.user.displayAvatarURL({dynamic: true}))
                let counter = 0;
                for (let i = 0; i < queue.songs.length; i += 20) {
                    if (counter >= 10) break;
                    embed.setDescription("" + queue.songs.map((song, id) =>
                        `**#${id+1}** - ${song.name} ─ ${song.formattedDuration}`).join("\n"));
                    counter++;
                }
                if (queue.songs.length > 25) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "Cannot display queue: too many songs.")]});
                }
                return await interaction.reply({embeds: [embed]});
            } catch (err) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "error", "There are no songs currently queued.")]});
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