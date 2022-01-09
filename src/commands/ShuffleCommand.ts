import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import Utilities from "../utils/Utilities";

export default class ShuffleCommand implements ICommand {

    public name: string = "shuffle";
    public description: string = "Shuffle the order of the songs in the queue.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const queue = player.getQueue(interaction.guild.id);
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    if (!queue || !queue.playing) {
                        const embed = EmbedUtil.getErrorEmbed("There are no songs in the queue.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (queue.tracks.length <= 1) {
                        const embed = EmbedUtil.getErrorEmbed("The queue isn't large enough to be shuffled.");
                        return await interaction.reply({embeds: [embed]});
                    } else {
                        queue.shuffle();
                        const embed = EmbedUtil.getDefaultEmbed("Shuffled the queue successfully.");
                        return await interaction.reply({embeds: [embed]});
                    }
                } else {
                    return await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                Utilities.sendWebhookMessage(error, true, interaction.guild.id);
                const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
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