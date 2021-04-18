import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";
import { user } from "../../types";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";

module.exports = {
    name: "showkey",
    description: "shows you your fates admin key",
    usage: "showkey",
    run(message: Message) {
        AsyncQuery<Array<user>>("SELECT `key` FROM whitelist.user WHERE discord_id = ?",
            [message.author.id]
        ).then(res => {
            if (res[0].key) {
                message.author.send(new MessageEmbed()
                    .setTitle("Key")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`your key is ${res[0].key}, don't share it`)
                )
                .then(() => {
                    message.inlineReply("sent your key in dms");
                })
                .catch(err => {
                    message.inlineReply("could not send you your key, turn on your dms");
                })
            } else {
                message.reply("You are not whitelisted.");
            }
        }, (r) => handleSqlRejection(r,message));
    }
} as Command