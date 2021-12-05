import {Client} from "discord.js";
import Logger from "../Logger";
import Config from "../Config";

export default class BaseApp {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public login(): void {
        Logger.clear();
        this.client.login(Config.get("TOKEN")).then(() => {});
    }
}