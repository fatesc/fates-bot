import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "eval",
    description: "execute node on the bot's vm",
    usage: "eval [something]",
    permission: "OWNER",
    run(message: Message, args: string[]) {
        if (!args.length) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        const code = args.join(" ").replace(/^`\S+|`+$/gm, "");
        if (code.includes("token")) return
        let exec: string
        try {
            exec = eval(code);
        } catch (err) {
            if (err instanceof SyntaxError) {
                exec = `${err.name}: ${err.message}`
            } else {
                exec = err
            }
        }
        message.channel.send("", {
            embed: new MessageEmbed()
                .setTitle("Eval")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(exec),
            disableMentions: "all"
        });
    }
} as Command