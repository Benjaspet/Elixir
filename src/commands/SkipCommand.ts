import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {Queue} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";

export default class SkipCommand implements ICommand {

    public name: string = "skip";
    public description: string = "Skip to the next song in the queue.";
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
                const skipTo = interaction.options.getNumber("track");
                if (member instanceof GuildMember) {
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (queue.tracks.length <= 1) {
                        const embed = EmbedUtil.getDefaultEmbed("There were no more tracks, so I left.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (skipTo) {
                        try {
                            queue.skipTo(skipTo);
                            const embed = EmbedUtil.getDefaultEmbed("Skipped to track **#" + skipTo + "**.");
                            return await interaction.reply({embeds: [embed]});
                        } catch (error: any) {
                            const embed = EmbedUtil.getErrorEmbed("That track number is not in the queue.");
                            return await interaction.reply({embeds: [embed]});
                        }
                    } else {
                        queue.skip();
                        const embed = EmbedUtil.getDefaultEmbed("Skipped to the next track.");
                        return await interaction.reply({embeds: [embed]});
                    }
                }
            } catch (error) {
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
        description: this.description,
        options: [
            {
                name: "track",
                description: "The track position to skip to.",
                type: ApplicationCommandOptionTypes.NUMBER,
                required: false,
                autocomplete: false
            }
        ]
    };
}