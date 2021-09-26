import * as fs from "fs";
import {Client} from "discord.js";
import InfoCommand from "../commands/InfoCommand";
import FilterCommand from "../commands/FilterCommand";
import HelpCommand from "../commands/HelpCommand";
import JoinCommand from "../commands/JoinCommand";
import NowPlayingCommand from "../commands/NowPlayingCommand";
import PauseCommand from "../commands/PauseCommand";
import QueueCommand from "../commands/QueueCommand";
import ResumeCommand from "../commands/ResumeCommand";
import ShuffleCommand from "../commands/ShuffleCommand";
import SkipCommand from "../commands/SkipCommand";
import StopCommand from "../commands/StopCommand";
import VolumeCommand from "../commands/VolumeCommand";
import PlayCommand from "../commands/PlayCommand";
import LoopCommand from "../commands/LoopCommand";

export default class PonjoBuilder {

    public static initAllEvents(client: Client) {
        const eventFiles = fs.readdirSync(__dirname + "/../events").filter(file => file.endsWith(".ts"));
        for (const file of eventFiles) {
            const event = require(__dirname + `/../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }

    public static initAllMusicEvents(client: Client) {

        const interactions = fs.readdirSync(__dirname + "/../events/music").filter(file => file.endsWith('.ts'));

        for (const file of interactions) {
            const interaction = require(__dirname + `/../events/music/${file}`);
            if (interaction.once) {
                client.once(interaction.name, (...args) => interaction.execute(...args, client));
            } else {
                client.on(interaction.name, (...args) => interaction.execute(...args, client));
            }
        }
    }

    public static initAllSlashCommands(client: Client) {
        client.on("interactionCreate", (...args) => {
            new InfoCommand(client).execute(...args).then(() => {});
            new FilterCommand(client).execute(...args).then(() => {});
            new HelpCommand(client).execute(...args).then(() => {});
            new JoinCommand(client).execute(...args).then(() => {});
            new NowPlayingCommand(client).execute(...args).then(() => {});
            new PauseCommand(client).execute(...args).then(() => {});
            new QueueCommand(client).execute(...args).then(() => {});
            new ResumeCommand(client).execute(...args).then(() => {});
            new ShuffleCommand(client).execute(...args).then(() => {});
            new SkipCommand(client).execute(...args).then(() => {});
            new StopCommand(client).execute(...args).then(() => {});
            new VolumeCommand(client).execute(...args).then(() => {});
            new PlayCommand(client).execute(...args).then(() => {});
            new LoopCommand(client).execute(...args).then(() => {});
        });
    }
}