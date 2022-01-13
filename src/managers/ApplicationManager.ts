import {Client} from "discord.js";
import Logger from "../structs/Logger";
import Config from "../structs/Config";

export default class ApplicationManager {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public login(): void {
        Logger.clear();
        this.client.login(Config.get("TOKEN")).then(() => {});
    }
}