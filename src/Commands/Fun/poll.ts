import { Message, Util } from "discord.js";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand"

module.exports = {
    name: "poll",
    description: "makes a poll with yes or no",
    usage: "poll [question]",
    run(message: Message, args: string[]) { 
        if (!args[0]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        const polltext = args.join(" ")
        message.channel.send(`poll: \`${polltext}\`\n\n:one: yes\n\n:two: no\n\n`, {
            disableMentions: "all"
        })
        .then(async msg => {
            await msg.react("1️⃣");
            await msg.react("2️⃣");
        });
    }
} as Command