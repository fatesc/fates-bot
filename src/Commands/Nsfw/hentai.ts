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
        if (!args[0]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        const amount = +args[0]
        if (!!amount) {
            args.shift();
        }
        const tags = args.join(",");
        
        if (!!amount && amount > 3 && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`max is 3!! ${message.member}`);
        
        fetch(`https://api.r34.app/booru/gelbooru/posts?baseEndpoint=rule34.xxx&limit=${!amount ? 1 : amount}&tags=${tags}&tagsEndpoint=/autocomplete.php&defaultQueryIdentifiersTagsTag=q&defaultQueryIdentifiersTagsTagEnding=`, {
            method: "GET", 
        })
        .then(res => res.json())
        .then(res => {
            const files = res.map((a: any) => a.high_res_file.url);
            
            for (let i = 0; i < files.length; i += 4) {
                message.inlineReply(`${files.slice(i, i + 4).join(" ")}`);
            }
        }, r => {
            message.inlineReply(r)
        })
    }
} as Command
