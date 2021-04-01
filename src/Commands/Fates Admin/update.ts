import { Message, MessageEmbed } from "discord.js";
import { ResultSetHeader } from "mysql2";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";

module.exports = { 
    name: "update",
    description: "updates a users whitelist for fates admin",
    usage: "update [user] [hwid/whitelist]",
    permission: ["Support", "Mod", "ADMINISTRATOR"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const whitelist = args[1] && args[1].length == 64 ? args[1] : undefined
        if (!whitelist || !Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        AsyncQuery<ResultSetHeader>("UPDATE whitelist.user SET fingerprint = ? WHERE discord_id = ?",
           [whitelist, Target.user.id]
        )
        .then(res => {
            if (res.affectedRows >= 1) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`updated ${Target}'s whitelist`)
                );
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, user couldn't be updated`)
                );
            }
        }, (r) => handleSqlRejection(r,message));
    }
} as Command