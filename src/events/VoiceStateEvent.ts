import {Client, ClientEvents, VoiceState} from "discord.js";
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

    public async execute(oldState: VoiceState, newState: VoiceState) {
        // if (newState.channel) {
        //     await newState.set(true);
        //     MusicPlayer.streamCount++;
        // } else {
        //     MusicPlayer.streamCount--;
        // }
    }
}