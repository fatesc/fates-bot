import { Message } from "discord.js";
import { Command } from "../../types";

module.exports = {
    name: "pp",
    description: "shows the size of your ****",
    usage: "pp [user?]",
    cooldown: 1,
    run(message: Message, args: string[]) {
        const Target = args[0] ? message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member : message.member
        const size = [Math.round(Math.random() * 100), +Target.user.id.substring(0,2).split("").reverse().join("")][Math.round(Math.random() * 2)]
        message.inlineReply(`${Target} your dick size is ${message.member.hasPermission("ADMINISTRATOR") || Target.hasPermission("ADMINISTRATOR") ? "**MAX** :sunglasses:" : size < 50 ? size + " :rofl:" : size + " :flushed:"}`);
    }
} as Command