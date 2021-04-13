import { Command, user } from "../../types";
import { Message } from "discord.js";
import { AsyncQuery } from "../Util/Query";
import { ResultSetHeader } from "mysql2";
import { helpCommand } from "../Util/HelpCommand";
import { MessageEmbed } from "discord.js";

module.exports = {
    name: "transferwl",
    description: "transfers another users whitelist to another user",
    usage: "transferwl [user1] [user2]",
    run(message: Message, args: string[]) {
        const user1 = Array.from(message.mentions.users.values())[0]
        const user2 = Array.from(message.mentions.users.values())[1]
        if (!user1 || !user2) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        AsyncQuery<Array<user>>("SELECT fingerprint, `key` FROM whitelist.user WHERE discord_id = ?", [user1.id])
        .then(res => res?.[0])
        .then(res => {
            if (res.fingerprint && res.key) {
                AsyncQuery<ResultSetHeader>("INSERT INTO whitelist.user(`key`,`fingerprint`,`discord_id`,`discord_tag`) VALUES(?,?,?,?)",
                    [res.key, res.fingerprint, user2.id, user2.tag]
                )
                .then(res => {
                    if (res.affectedRows >= 1) {
                        AsyncQuery<ResultSetHeader>("DELETE FROM whitelist.user WHERE discord_id = ?", [user1.id]);
                        message.channel.send(new MessageEmbed()
                            .setTitle("Completed")
                            .setAuthor(message.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`transfered ${user1}'s whitelist to ${user2}`)
                        )
                    }
                })
            }
        })
    }
} as Command