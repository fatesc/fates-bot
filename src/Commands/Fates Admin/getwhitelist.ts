import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "getwhitelist",
    description: "gets a users whitelist",
    usage: "getwhitelist [user]",
    permission: ["Mod", "Support", "ADMINISTRATOR"],
    aliases: ["getwl"],
    run(message: Message, args: string[], db: MongoClient) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        const database = db.db("fates-admin-v2");

        database.collection("whitelists").findOne({discord_id: Target.user.id }, (err, res) => {
            if (res) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target}'s whitelist information:\n\`\`\`json\n${JSON.stringify(res)}\`\`\``)
                )
            } else {
                message.channel.send(new MessageEmbed()
                .setTitle("Fail")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} is not whitelisted, couldn't show the users whitelist`)
                )
            }
        })
    }
} as Command