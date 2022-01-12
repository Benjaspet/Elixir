import {ApplicationCommandData, Client, CommandInteraction, GuildMember} from "discord.js";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import {Queue} from "discord-player";
import Logger from "../Logger";
import Utilities from "../utils/Utilities";
import QueueNavigator from "../utils/QueueNavigator";
import Command from "../Command";

export default class QueueCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("queue", {
            name: "queue",
            description: "View all songs in the queue."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member = interaction.member;
            if (member instanceof GuildMember) {
                if (!queue) {
                    const embed = EmbedUtil.getDefaultEmbed("There are no songs in the queue.");
                    return await interaction.reply({embeds: [embed]});
                }
                return void await QueueNavigator.createQueueEmbed(queue, interaction);
            } else {
                return await interaction.reply({content: "This command must be run in a guild."});
            }
        } catch (error: any) {
            Logger.error(error);
            console.log(error)
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
            return await interaction.reply({embeds: [embed]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}