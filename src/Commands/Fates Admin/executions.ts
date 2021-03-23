import { Command, user } from "../../types";
import { Message } from "discord.js"
import { AsyncQuery } from "../Util/Query";
import { MessageEmbed } from "discord.js";

module.exports = {
    name: "executions",
    description: "shows executions of you or a user",
    usage: "executions [user?]",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

        AsyncQuery<Array<user>>("SELECT execution_count FROM whitelist.user WHERE discord_id = ?",[Target.user.id])
        .then(res => {
            if (res?.[0]?.execution_count) {
                message.channel.send(new MessageEmbed()
                    .setTitle("Executions")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} has ${res[0].execution_count} amount of executions!`)
                )
            } else {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is not whitelisted, could not show execution count`)
                )
            }
        })
    }
} as Command