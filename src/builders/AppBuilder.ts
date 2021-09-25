import PonjoBuilder from "./PonjoBuilder";
import {Client} from "discord.js";
import config from "../resources/Config";

export default class AppBuilder extends PonjoBuilder {

    constructor(client: Client) {
        super();
        console.clear();
        client.login(config.token).then(() => {});
    }
}