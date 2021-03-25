import { Message, MessageEmbed } from "discord.js";

module.exports = {
    name: "eval",
    description: "execute node on the bot's vm",
    usage: "eval [something]",
    run(message: Message, args: string[]) {
        const code = args.join(" ").replace(/^`\S+|`+$/gm, "");
        const exec = eval(code);
        message.channel.send("", {
            embed: new MessageEmbed()
                .setTitle("Eval")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(exec),
            disableMentions: "all"
        });
    }
}