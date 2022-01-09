import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {Queue} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import Utilities from "../utils/Utilities";

export default class VolumeCommand implements ICommand {

    public name: string = "volume";
    public description: string = "Amplify or lower the music volume.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            await interaction.deferReply();
            try {
                const queue: Queue = player.getQueue(interaction.guild);
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    const volume = interaction.options.getNumber("amplifier");
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return await interaction.editReply({embeds: [embed]});
                    } else if (queue.volume == volume) {
                        const embed = EmbedUtil.getErrorEmbed("Please select a volume different from the current.");
                        return await interaction.editReply({embeds: [embed]});
                    } else {
                        queue.setVolume(volume);
                        const embed = EmbedUtil.getDefaultEmbed("Successfully set the volume to **" + volume + "**.");
                        return await interaction.editReply({embeds: [embed]});
                    }
                } else {
                    return await interaction.editReply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                Utilities.sendWebhookMessage(error, true, interaction.guild.id);
                const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
                return await interaction.editReply({embeds: [embed]});
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
                name: "amplifier",
                description: "The volume amplifier.",
                type: ApplicationCommandOptionTypes.NUMBER,
                required: true,
                choices: [
                    {
                        name: "100",
                        value: 100
                    },
                    {
                        name: "80",
                        value: 80
                    },
                    {
                        name: "60",
                        value: 60
                    },
                    {
                        name: "50",
                        value: 50
                    },
                    {
                        name: "40",
                        value: 40
                    },
                    {
                        name: "20",
                        value: 20
                    }
                ]
            }
        ]
    };
}