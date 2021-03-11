import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "ban",
    description: "bans a member",
    usage: "ban [user] [?reason]",
    permission: "BAN_MEMBERS",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        Target.ban({reason}).then(member => {
            message.channel.send(new MessageEmbed()
                .setTitle("Banned")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} is now banned from this guild`)
            );
        }, reject => {
            message.channel.send(new MessageEmbed()
                .setTitle("Fail")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Target} could not be banned from this guild ||${reject}||`)
            );
        });
    }
} as Command