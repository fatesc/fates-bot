import { Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";

module.exports = {
    name: "showkey",
    description: "shows you your fates admin key",
    usage: "showkey",
    run(message: Message, args: string[], db: MongoClient) {
        const database = db.db("fates-admin-v2");

        database.collection("whitelists").findOne({discord_id:message.author.id}, (err, res) => {
            if (res) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Key")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`your key is ${res.key}, don't share it`)
                );
            } else {
                message.channel.send("not whitelisted");
            }
        })
    }
} as Command