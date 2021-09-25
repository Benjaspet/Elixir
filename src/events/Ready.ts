import SlashCommandManager from "../managers/SlashCommandManager";
import ElixirUtil from "../utils/ElixirUtil";
import {EasySpotify, EasySpotifyConfig} from "easy-spotify-ts";
import config from "../resources/Config";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "LISTENING", name: ElixirUtil.getTotalElixirMemberCount(client) + " users!"});
        await new SlashCommandManager(client).updateAllSlashCommands(client, true);

        const spotify = new EasySpotify(new EasySpotifyConfig(config.spotifyApi.accessToken));
        const tracks = await spotify.searchTracks("es mejor asi primera fila", {limit: 5});
        console.log(tracks)

    },
};