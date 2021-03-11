import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";
import { helpCommand } from "../Util/HelpCommand";

module.exports = { 
    name: "blacklist",
    description: "blacklists a user",
    usage: "blacklist [user] [?reason]",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[], db: MongoClient) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        const database = db.db("fates-admin-v2");
        database.collection("whitelists").findOneAndUpdate({ discord_id: Target.user.id }, {$set:{blacklisted:true,reason:reason??null}}, (err, res) => {
            if (res.value) {
                Target.roles.remove(message.guild.roles.cache.find(role => role.name.toLowerCase() == "buyer"))
                .then(m => {
                    message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${m} is now blacklisted` + reason ? ` with reason ${reason}` : ``)
                    )
                }, r => {
                    message.channel.send(new MessageEmbed()
                        .setTitle("Fail")
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${Target} is blacklisted but i could not remove the buyer role, ||${r}||`)
                    );
                })
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, couldn't blacklist.`)
                )
            }
        });
    }
} as Command