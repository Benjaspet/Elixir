const {readdirSync} = require('fs');
const client = require("../Elixir");

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

readdirSync("./slash/").forEach((file) => {
    const events = readdirSync("./slash/").filter((file) =>
        file.endsWith(".js")
    );
    for (let file of events) {
        let pull = require(`../slash/${file}`);
        if (pull.name) {
            client.events.set(pull.name, pull);
        }
    }
});

readdirSync("./buttons/").forEach((file) => {
    const events = readdirSync("./buttons/").filter((file) =>
        file.endsWith(".js")
    );
    for (let file of events) {
        let pull = require(`../buttons/${file}`);
        if (pull.name) {
            client.events.set(pull.name, pull);
        }
    }
});