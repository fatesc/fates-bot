import fetch from "node-fetch";
import { Message } from "discord.js";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "hentai",
    description: "gives you hentai with amount (optional)",
    usage: "hentai [amount?/tag1?] [tag2?] [tag3?] ...",
    nsfw: true,
    cooldown: 2,
    guildOnly: true,
    run(message: Message, args: string[]){
        const amount = args[0] ? !isNaN(+args[0]) ? +args[0] : 1 : 1
        if (!isNaN(+args[0])) {
            args.shift();
        }
        const searchquery = args.join(" ").replace(/\W/g, "");
        if (amount > 3 && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`max is 3!! ${message.member}`);
        fetch(`https://danbooru.donmai.us/posts.json?tags=${searchquery}&limit=200`)
        .then(res => res.json())
        .then((res: Array<any>) => {
            const files = res.sort(() => .5 - Math.random()).filter(a => !a.has_visible_children && !a.has_children).map(a => a.large_file_url).slice(0, amount);
            for (let i = 0; i < files.length; i += 4) {
                message.inlineReply(`${files.slice(i, i + 4).join(" ")}`);
            }
        })
    }
} as Command
