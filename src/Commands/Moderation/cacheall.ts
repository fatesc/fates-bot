import { Client, Message, MessageFlags } from "discord.js";
import { Command } from "../../types";

module.exports = {
    name: "cacheall",
    description: "caches all the users in the server if not already",
    permission: "ADMINISTRATOR",
    cooldown: 30,
    usage: "cacheal;",
    run(message : Message, args : string[]){
        message.guild.members.fetch().then(() => message.inlineReply(`cached ${message.guild.members.cache.size} members in ${message.guild.name}`));
    }
} as Command