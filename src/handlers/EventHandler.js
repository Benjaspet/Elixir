const {readdirSync} = require('fs');
const client = require("../Elixir");

module.exports = client => {

    readdirSync("./events/").forEach((file) => {
        const events = readdirSync("./events/").filter((file) =>
            file.endsWith(".js")
        );
        for (let file of events) {
            let pull = require(`../events/${file}`);
            if (pull.name) {
                client.events.set(pull.name, pull);
            }
        }
    });

    readdirSync("./events/music/").forEach((file) => {
        const events = readdirSync("./events/music/").filter((file) =>
            file.endsWith(".js")
        );
        for (let file of events) {
            let pull = require(`../events/music/${file}`);
            if (pull.name) {
                client.events.set(pull.name, pull);
            }
        }
    });

}