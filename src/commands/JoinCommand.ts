import * as Discord from "discord.js";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import VoiceManager from "../managers/VoiceManager";

export default class JoinCommand implements PonjoCommand {

    public name: string = "join";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Have Elixir join the voice channel.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            DatabaseUtil.addExecutedCommand(1);
            const channel = interaction.member?.voice.channel;
            if (!channel) {
                return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "error", "You must be in a voice channel to run this command.")]});
            }
            await VoiceManager.connectToVoiceChannel(channel);
            const embed = new Discord.MessageEmbed()
                .setColor("PURPLE")
                .setDescription("I've joined and bound myself to the voice channel.")
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