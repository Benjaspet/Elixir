const Discord = require("discord.js");
const client = require("../Elixir");
const config = require("../resources/config.json");

async function sendSuccess(string) {

    return new Discord.MessageEmbed()
        .setTitle(`${string}`)
        .setColor("GREEN");

}

async function sendError(string) {

    return new Discord.MessageEmbed()
        .setTitle(`${string}`)
        .setColor("RED");

}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanDurationFormat(ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (60 * 1000)) % 60).toString();
    const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
    return `${hrs}h ${min}m ${sec}s.`;
}

module.exports = {
    sendSuccess, sendError, sleep, cleanDurationFormat
}