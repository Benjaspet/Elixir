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

module.exports = {
    sendSuccess, sendError, sleep
}