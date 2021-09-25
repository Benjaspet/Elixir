import {Client} from "discord.js";
import config from "../resources/Config";

export default class AppBuilder {

    private client: Client;

    constructor(client: Client) {
        this.client = client;
        console.clear();
        client.login(config.token).then(() => {});
    }
}