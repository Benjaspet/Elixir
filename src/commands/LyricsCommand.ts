import {ApplicationCommandData, Client, CommandInteraction, MessageEmbed} from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import LyricUtil from "../utils/LyricUtil";
import Logger from "../structs/Logger";
import Vars from "../constants/Vars";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";

export default class LyricsCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("lyrics", {
            name: "lyrics",
            description: "Obtain lyrics from any song.",
            options: [
                {
                    name: "track",
                    description: "The track to obtain lyrics from.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true,
                    autocomplete: false
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        await interaction.deferReply();
        try {
            const track = interaction.options.getString("track");
            const result = await LyricUtil.getLyrics(track);
            if (!result) {
                const embed = EmbedUtil.getErrorEmbed("No lyrics found.");
                return void await interaction.editReply({embeds: [embed]});
            } else {
                const trimmed = result.lyrics.length > 4095 ? result.lyrics.substring(0, 4092) + "..." : result.lyrics;
                const embed = new MessageEmbed()
                    .setAuthor({name: "Lyrics Found", iconURL: null, url: result.source.link})
                    .setDescription(trimmed)
                    .setColor(Vars.DEFAULT_EMBED_COLOR)
                    .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL()})
                    .setTimestamp()
                return void await interaction.editReply({embeds: [embed]});
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
            return void await interaction.editReply({embeds: [embed]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}