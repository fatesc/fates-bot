import { Message, MessageEmbed } from "discord.js";
import { memoryUsage } from "process";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "kick",
    description: "kicks a user",
    usage: "kick [user] [?reason]",
    permission: "KICK_MEMBERS",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        Target.kick(reason).then(member => {
            message.channel.send(new MessageEmbed()
                .setTitle("Kicked")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} is now kicked from this guild`)
            );
        }, reject => {
            message.channel.send(new MessageEmbed()
                .setTitle("Fail")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} could not be kicked from this guild ||${reject}||`)
            );
        });
    }
} as Command