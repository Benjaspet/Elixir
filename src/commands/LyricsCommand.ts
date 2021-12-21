import {Client, CommandInteraction, MessageEmbed} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import LyricUtil from "../utils/LyricUtil";
import Logger from "../Logger";
import Vars from "../constants/Vars";

export default class LyricsCommand implements ICommand {

    public name: string = "lyrics";
    public description: string = "Obtain lyrics from any song.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const track = interaction.options.getString("track");
                const result = await LyricUtil.base.search(track);
                if (!result) {
                    const embed = EmbedUtil.getErrorEmbed("No lyrics found.");
                    return await interaction.reply({embeds: [embed]});
                } else {
                    const trimmed = result.lyrics.length > 4095 ? result.lyrics.substring(0, 4092) + "..." : result.lyrics;
                    const embed = new MessageEmbed()
                        .setTitle(result.title + " ─ " + result.artist.name)
                        .setURL(result.url)
                        .setThumbnail(result.thumbnail)
                        .setDescription(trimmed)
                        .setColor(Vars.DEFAULT_EMBED_COLOR)
                        .setFooter("Elixir Music", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    return await interaction.reply({embeds: [embed]});
                }
            } catch (error: any) {
                Logger.error(error);
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
        description: this.description,
        options: [
            {
                name: "track",
                description: "The track to obtain lyrics from.",
                type: ApplicationCommandOptionTypes.STRING,
                required: true,
                autocomplete: false
            }
        ]
    };
}