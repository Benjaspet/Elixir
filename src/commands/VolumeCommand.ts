import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {Queue} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";

export default class VolumeCommand implements ICommand {

    public name: string = "volume";
    public description: string = "Amplify or lower the music volume.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member = interaction.member;
            if (member instanceof GuildMember) {
                const volume = interaction.options.getNumber("amplifier");
                if (!queue || !queue.playing) {
                    const embed = EmbedUtil.getErrorEmbed("There are no songs in the queue.")
                    return await interaction.reply({embeds: [embed]});
                } else if (queue.volume == volume) {
                    const embed = EmbedUtil.getErrorEmbed("Please select a volume different from the current.");
                    return await interaction.reply({embeds: [embed]});
                } else {
                    queue.setVolume(volume);
                    const embed = EmbedUtil.getDefaultEmbed("Successfully set the volume to **" + volume + "**.");
                    return await interaction.editReply({embeds: [embed]});
                }
            } else {
                return await interaction.reply({content: "This command must be run in a guild."});
            }
        } catch (error: any) {
            Logger.error(error);
            const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
            return await interaction.reply({embeds: [embed]});
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