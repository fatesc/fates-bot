import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";
import { user } from "../../types";
import { helpCommand } from "../Util/HelpCommand";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";
import columnify from "columnify"

module.exports = {
    name: "getwhitelist",
    description: "gets a users whitelist",
    usage: "getwhitelist [user] [format]",
    permission: ["Mod", "Support", "ADMINISTRATOR"],
    aliases: ["getwl"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        AsyncQuery<Array<user>>("SELECT * FROM whitelist.user WHERE discord_id = ?",[Target.user.id])
        .then(res => {
            const format: Map<string, string> = new Map([["json",JSON.stringify(res[0])],["column", columnify(res[0])]]) 

            if (res) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target}'s whitelist information:\n\`\`\`${args[1] ? format.get(args[1]) ?? "json\n" + JSON.stringify(res[0]) : "json\n" + JSON.stringify(res[0])}\`\`\``)
                );
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, couldn't show the users whitelist`)
                );
            }
        }, (r) => handleSqlRejection(r,message));
    }
} as Command