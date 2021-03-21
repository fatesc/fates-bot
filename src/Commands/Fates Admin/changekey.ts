import { Message, MessageEmbed } from "discord.js";
import { ResultSetHeader } from "mysql2";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";
import { generateString } from "../Util/StringGen";

module.exports = {
    name: "changekey",
    description: "changes a key of a user",
    usage: "changekey [user]",
    permission: ["Mod", "Support"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const key = generateString(12);
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        AsyncQuery<ResultSetHeader>("UPDATE whitelist.user SET `key` = ? WHERE discord_id = ?", 
            [key, Target.user.id]
        )
        .then(res => {
            if (res.affectedRows >= 1) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target}'s key has been changed to \`${key}\``)
                );
                Target.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`your key has been changed to \`${key}\``)
                );
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, key couldn't be changed`)
                );
            }
        }, (r) => handleSqlRejection(r,message));
    }
} as Command