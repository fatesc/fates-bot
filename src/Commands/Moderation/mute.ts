import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";

module.exports = {
    name: "mute",
    description: "mutes a user",
    usage: "mute [user]",
    permission: ["Mod"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!Target) return message.channel.send("invalid command usage");

        const muteRole = message.guild.roles.cache.find(role => role.name.toLowerCase() == "muted");

        Target.roles.add(muteRole).then(member => {
            message.channel.send(new MessageEmbed()
                .setTitle("Muted")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} is now muted (this is a permanent mute)`)
            );
        }, reject => {
            message.channel.send(new MessageEmbed()
                .setTitle("Fail")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} could not be muted ||${reject}||`)
            );
        });
    }
} as Command
