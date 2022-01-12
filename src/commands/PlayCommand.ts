import {
    ApplicationCommandData,
    Client,
    CommandInteraction,
    GuildMember,
    MessageEmbed,
    StageChannel,
    VoiceChannel
} from "discord.js";
import {QueryType, Queue} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import MusicPlayer from "../utils/MusicPlayer";
import Utilities from "../utils/Utilities";
import Command from "../Command";

export default class PlayCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("play", {
            name: "play",
            description: "Play a song in a voice channel with a link or query.",
            options: [
                {
                    name: "song",
                    description: "The URL or song query.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ],
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        await interaction.deferReply();
        try {
            const track = interaction.options.getString("song");
            const member = interaction.member;
            if (member instanceof GuildMember) {
                const channel: VoiceChannel|StageChannel = member.voice.channel;
                if (!channel) {
                    const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return void await interaction.editReply({embeds: [embed]});
                }
                const searchResult = await player.search(track, {limit: 5});
                const embed: MessageEmbed = EmbedUtil.getDefaultEmbed("Searching for the track...");
                await interaction.editReply({embeds: [embed]});
                if (!searchResult || !searchResult.tracks.length) {
                    const embed = EmbedUtil.getErrorEmbed("No search results found.");
                    return await interaction.followUp({embeds: [embed]});
                }
                await player.playCustomPlaylist()
                const queue: Queue = player.getQueue(interaction.guild)
                    ? player.getQueue(interaction.guild)
                    : player.createQueue(interaction.guild, MusicPlayer.getQueueInitOptions(interaction));
                if (searchResult.playlist) {
                    if (searchResult.playlist.tracks.length > 300) {
                        const embed = EmbedUtil.getErrorEmbed("You cannot add playlists with over 300 tracks.");
                        return void await interaction.followUp({embeds: [embed]});
                    } else searchResult.tracks[0].playlist = searchResult.playlist;
                }
                let connected: boolean;
                try {
                    if (!queue.connection) {
                        await queue.connect(member.voice.channel);
                        connected = true;
                    }
                } catch (error: any) {
                    const embed = EmbedUtil.getErrorEmbed("Unable to join your voice channel.");
                    await player.deleteQueue(interaction.guild);
                    await queue.destroy(true);
                    return void await interaction.editReply({embeds: [embed]});
                }
                searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
                if (connected) await queue.play();
                MusicPlayer.setPlaying(queue, true);
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
            return void await interaction.followUp({embeds: [embed]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}