import {IEvent} from "../interfaces/IEvent";
import {
    ButtonInteraction,
    Client,
    ClientEvents,
    CommandInteraction,
    GuildMember,
    Interaction, MessageEmbed
} from "discord.js";
import MusicPlayer from "../utils/MusicPlayer";
import DatabaseUtil from "../utils/DatabaseUtil";
import BaseResponder from "../base/BaseResponder";
import ButtonClickEvent from "./ButtonClickEvent";
import SearchResultEvent from "./SearchResultEvent";
import EmbedUtil from "../utils/EmbedUtil";

export default class InteractionEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.inGuild()) {
            if (interaction.isCommand()) {
                if (interaction.member instanceof GuildMember) {
                    MusicPlayer.getRequiredPermissions().forEach(perm => {
                        if (!interaction.guild.me.permissions.has(perm)) {
                            return interaction.reply({content: "I don't have sufficient permissions."});
                        }
                    });
                    await DatabaseUtil.addExecutedCommand(1);
                    await BaseResponder.respondToApplicationCommands(this.client, interaction);
                }
            } else if (interaction.isButton()) {
                await new ButtonClickEvent(this.client, "interactionCreate", false).execute(interaction);
            } else if (interaction.isAutocomplete()) {
                await new SearchResultEvent(this.client, "interactionCreate", false).execute(interaction);
            }
        } else {
            const embed: MessageEmbed = EmbedUtil.getDefaultEmbed("Unfortunately, Elixir Music only supports " +
                "guild commands at this time. You can only execute commands in a server, and not in direct messages " +
                "for the time being.")
            if (interaction instanceof CommandInteraction || interaction instanceof ButtonInteraction) {
                return void await interaction.reply({embeds: [embed]});
            } else return;
        }
    }
}