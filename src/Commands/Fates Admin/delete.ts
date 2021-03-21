import { Message, MessageEmbed } from "discord.js";
import { ResultSetHeader } from "mysql2";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";
import { AsyncQuery } from "../Util/Query";

module.exports = {
    name: "deletedata",
    description: "deltetes a users whitelist from a db",
    usage: "deletedata [user]",
    permission: "ADMINISTRATOR",
    aliases: ["delete"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        AsyncQuery<ResultSetHeader>("DELETE FROM whitelist.user WHERE discord_id = ?", [Target.user.id])
        .then(res => {
            if (res.affectedRows >= 1) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target}'s whitelist is now removed from the database`)
                );
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, user couldn't be deleted`)
                );
            }
        });

    }
} as Command