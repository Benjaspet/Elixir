import * as Discord from "discord.js";
import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";

export default class QueueCommand implements ICommand {

    public name: string = "queue";
    public description: string = "View all songs in the queue.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
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
                    .setFooter(`Elixir Music`, this.client.user.displayAvatarURL({dynamic: true}))
                let counter = 0;
                for (let i = 0; i < queue.songs.length; i += 20) {
                    if (counter >= 10) break;
                    embed.setDescription("" + queue.songs.map((song, id) =>
                        `**#${id+1}** - ${song.name} ─ ${song.formattedDuration}`).join("\n"));
                    counter++;
                }
                if (queue.songs.length > 25) {
                    return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("Cannot display queue: too many songs.")]});
                }
                return await interaction.reply({embeds: [embed]});
            } catch (err) {
                return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There are no songs currently queued.")]});
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