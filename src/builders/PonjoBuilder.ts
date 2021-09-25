import {Client} from "discord.js";
import * as fs from "fs";

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

        });
    }
}