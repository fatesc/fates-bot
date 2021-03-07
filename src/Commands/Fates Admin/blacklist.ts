import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
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
                message.channel.send(new MessageEmbed()
                    .setTitle("Completed")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${Target} is now blacklisted` + reason ? ` with reason ${reason}` : ``)
                )
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