import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";
import { helpCommand } from "../Util/HelpCommand";
import { generateString } from "../Util/StringGen";

module.exports = {
    name: "deletedata",
    description: "deltetes a users whitelist from a db",
    usage: "deletedata [user]",
    permission: "ADMINISTRATOR",
    aliases: ["delete"],
    run(message: Message, args: string[], db: MongoClient) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        const database = db.db("fates-admin-v2");

        database.collection("whitelists").findOneAndDelete({discord_id: Target.user.id }, (err, res) => {
            if (res.value) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target}'s whitelist is now removed from the database`)
                )
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, user couldn't be deleted`)
                )
            }
        })
    }
} as Command