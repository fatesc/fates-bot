import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";

module.exports = {
    name: "avatar",
    description: "shows you the users avatar",
    usage: "avatar [user?]",
    aliases: ["av"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        message.channel.send(new MessageEmbed()
            .setTitle("Avatar")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setImage(Target.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        );
    }
} as Command