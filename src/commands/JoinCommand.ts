import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import VoiceManager from "../managers/VoiceManager";

export default class JoinCommand implements ICommand {

    public name: string = "join";
    public description: string = "Have Elixir join the voice channel.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const channel = interaction.member?.voice.channel;
            if (!channel) {
                return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]});
            }
            await VoiceManager.connectToVoiceChannel(channel);
            const embed = EmbedUtil.getDefaultEmbed("I've joined and bound myself to the voice channel.");
            return await interaction.reply({embeds: [embed]});
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