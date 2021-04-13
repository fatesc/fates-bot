import { Message } from "discord.js";
import { Command } from "../../types";
import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";

module.exports = {
    name: "whois",
    description: "gives you information about the user",
    usage: "whois [user]",
    cooldown: 3,
    run(message: Message, args: string[]) {
        const Target = args[0]
        fetch("http://localhost/api/discord/user/" + Target)
        .then(res => res.json())
        .then(res => {
            message.channel.send(new MessageEmbed()
                .setTitle("Result")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`username: ${res.username}#${res.discriminator}, date created: ${res.createdAt}`) // more to add soon
            )
        })       
    }
} as Command