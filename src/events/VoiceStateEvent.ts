import {Client, ClientEvents, VoiceState} from "discord.js";
import Config from "../structs/Config";
import MusicPlayer from "../utils/MusicPlayer";

export default class VoiceStateEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
        if (newState.channel != null && newState.member.id === Config.get("CLIENT-ID")) {
            MusicPlayer.streamCount++;
        } else if (newState.channel == null && newState.member.id === Config.get("CLIENT-ID")) {
            MusicPlayer.streamCount--;
        }
    }
}