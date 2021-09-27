import PonjoBuilder from "./PonjoBuilder";
import {Client} from "discord.js";

export default class CommandBuilder extends PonjoBuilder {

    private readonly client;

    constructor(client: Client) {
        super();
        this.client = client;
        this.initAll();
    }

    private initAll(): void {
        PonjoBuilder.initAllEvents(this.client);
        PonjoBuilder.initAllMusicEvents(this.client);
        PonjoBuilder.initAllSlashCommands(this.client);
    }
}