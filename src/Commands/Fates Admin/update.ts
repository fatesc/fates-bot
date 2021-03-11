import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";
import { helpCommand } from "../Util/HelpCommand";

module.exports = { 
    name: "update",
    description: "updates a users whitelist for fates admin",
    usage: "update [user] [hwid/whitelist]",
    permission: ["Support"],
    run(message: Message, args: string[], db: MongoClient) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const whitelist = args[1] && args[1].length == 64 ? args[1] : undefined
        if (!whitelist || !Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        const database = db.db("fates-admin-v2");

        database.collection("whitelists").findOneAndUpdate({ discord_id: Target.user.id }, {$set:{fingerprint:whitelist}}, (err, res) => {
            if (res.value) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`updated ${Target}'s whitelist`)
                )
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, user couldn't be updated`)
                )
            }
        });
    }
} as Command