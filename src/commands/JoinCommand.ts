import {ApplicationCommandData, Client, CommandInteraction, GuildMember} from "discord.js";
const {joinVoiceChannel} = require("@discordjs/voice");
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import Utilities from "../utils/Utilities";
import Command from "../Command";

export default class JoinCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("join", {
            name: "join",
            description: "Have Elixir join the voice channel."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const member = interaction.member;
            if (member instanceof GuildMember) {
                if (!member.voice.channel) {
                    const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return void await interaction.reply({embeds: [embed]});
                } else {
                    const channel = member.voice.channel;
                    await joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    });
                    const embed = EmbedUtil.getDefaultEmbed(`I've joined **${channel.name}** successfully.`);
                    return void await interaction.reply({embeds: [embed]});
                }
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("I'm unable to join the voice channel. Do I have the correct permissions?");
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