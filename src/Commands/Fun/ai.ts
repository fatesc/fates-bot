import { Message, Util } from "discord.js"
import { Command } from "../../types"
import { helpCommand } from "../Util/HelpCommand";
import fetch from "node-fetch"

module.exports = {
    name: "ai",
    description: "sends an ai response to you",
    usage: "ai [query]",
    cooldown: 2,
    run(message: Message, args: string[]) {
        const msg = args.join(" ");
        if (!msg) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        fetch(`http://api.brainshop.ai/get?bid=155222&key=${process.env.BRAINKEY}&uid=${message.author.username}&msg=${msg}`)
        .then(res => res.json())
        .then(body => {
            message.inlineReply(body.cnt, {
                disableMentions: "all"
            });
        });
    }
} as Command
