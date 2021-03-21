import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";


module.exports = {
    name: "urban",
    description: "gets an urban defenition",
    usage: "urban [query]",
    cooldown: 3,
    run(message: Message, args: string[]) {
        const term = args.join(" ");
        if (!term) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        fetch(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${term}`, {
            method: "GET",
            headers: {
                ["x-rapidapi-key"]: "d027e753femshcfa3b72a5358e84p1d2624jsn92011f75d178",
            }
        }).then(res => res.json())
        .then(body => {
            const result = body.list[0]
            message.channel.send(new MessageEmbed()
                .setTitle("Urban definition")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .addField("`keyword`", `\`\`\`${result.word}\`\`\``)
                .addField("`definition`", `\`\`\`${result.definition}\`\`\``)
                .addField("`example`", `\`\`\`${result.example}\`\`\``));
        });
    }
} as Command