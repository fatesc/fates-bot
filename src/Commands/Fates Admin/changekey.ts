import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { helpCommand } from "../Util/HelpCommand";
import { generateString } from "../Util/StringGen";

module.exports = {
    name: "changekey",
    description: "changes a key of a user",
    usage: "changekey [user]",
    permission: ["Mod", "Support", "ADMINISTRATOR"],
    run(message: Message, args: string[], db: MongoClient) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const key = generateString(12);
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        const database = db.db("fates-admin-v2");

        database.collection("whitelists").findOneAndUpdate({discord_id: Target.user.id }, {$set:{key}}, (err, res) => {
            if (res.value) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target}'s key has been changed`)
                )
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, key couldn't be changed`)
                )
            }
        })
    }
} as Command