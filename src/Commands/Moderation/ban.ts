import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "ban",
    description: "bans a member",
    usage: "ban [user] [reason]",
    permission: "BAN_MEMBERS",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        Target.send("discord.gg/test", {
            embed: new MessageEmbed()
            .setTitle("Banned")
            .setDescription(`You have been banned from guild: \`${message.guild.name}\`\nReason: \`\`\`${reason}\`\`\`\n\nIf you would like to appeal you could join the server above.`)
        }).then(() => {
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
        }, reject => {
            Target.ban({reason}).then(member => {
                message.channel.send(new MessageEmbed()
                    .setTitle("Banned")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} is now banned from this guild, couln't dm user`)
                );
            }, reject => {
                message.channel.send(new MessageEmbed()
                    .setTitle("Fail")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${Target} could not be banned from this guild ||${reject}||`)
                );
            });
        })
    }
} as Command