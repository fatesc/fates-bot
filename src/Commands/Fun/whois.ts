import { Message } from "discord.js";
import { Command } from "../../types";
import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";

module.exports = {
    name: "whois",
    description: "gives you information about the user",
    usage: "whois [user (discordid)]",
    cooldown: 3,
    run(message: Message, args: string[]) {
        const Target = args[0]
        if (!/\d{18}/.test(Target)) return message.inlineReply("invalid discord id")
        fetch("http://bot.fate0.xyz/api/discord/user/" + Target)
        .then(res => res.json())
        .then(res => {
            message.channel.send(new MessageEmbed()
                .setTitle("Result")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setImage(res.avatarUrl)
                .setDescription(`username: ${res.username}#${res.discriminator}, date created: ${res.createdAt}`) // more to add soon
            )
        })
    }
} as Command