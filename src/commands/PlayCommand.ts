import {Client, CommandInteraction, GuildMember, MessageEmbed, StageChannel, VoiceChannel} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {QueryType, Queue, Track, TrackSource} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import playdl from "play-dl";
import MusicPlayer from "../utils/MusicPlayer";
import Utilities from "../utils/Utilities";

export default class PlayCommand implements ICommand {

    public name: string = "play";
    public description: string = "Play a song in a voice channel with a link or query.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            await interaction.deferReply();
            try {
                const track = interaction.options.getString("song");
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    let queue: Queue;
                    const channel: VoiceChannel|StageChannel = member.voice.channel;
                    if (!channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return void await interaction.editReply({embeds: [embed]});
                    }
                    const searchResult = await player.search(track, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.AUTO
                    });
                    const embed: MessageEmbed = EmbedUtil.getDefaultEmbed("Searching for the track...");
                    await interaction.editReply({embeds: [embed]});
                    if (!searchResult || !searchResult.tracks.length) {
                        const embed = EmbedUtil.getErrorEmbed("No search results found.");
                        return await interaction.followUp({embeds: [embed]});
                    }
                    if (!player.getQueue(interaction.guild)) {
                        queue = player.createQueue(interaction.guild, MusicPlayer.getQueueInitOptions(interaction));
                    } else {
                        queue = player.getQueue(interaction.guild);
                    }
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
                    await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
                    if (connected) await queue.play();
                    MusicPlayer.setPlaying(queue, true);
                }
            } catch (error: any) {
                Logger.error(error);
                Utilities.sendWebhookMessage(error);
                const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
                return void await interaction.followUp({embeds: [embed]});
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
                name: "song",
                description: "The URL or song query.",
                type: ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ],
    }
}