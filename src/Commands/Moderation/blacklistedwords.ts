import { Command } from "../../types";
import { Message, MessageEmbed } from "discord.js"
import { getServerConfig, setServerConfig } from "../Util/getConf";
import { helpCommand } from "../Util/HelpCommand";

module.exports = {
    name: "blacklistedwords",
    description: "adds a word to the blacklisted words",
    usage: "blacklistedwords [show/clear/add] [word/regex]",
    aliases: ["blwords"],
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[]) {
        if (!args[0]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        
        const embed = new MessageEmbed()
        embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))

        
        switch (args[0]) {
            case "show":
                getServerConfig(message.guild.id)
                .then(res => {
                    embed.setTitle("Complete")
                    embed.setDescription(res.config.blacklisted.length ? res.config.blacklisted.join(", ") : "no words blacklisted")
                    message.channel.send(embed)
                })
                break;
            case "clear":
                setServerConfig(message.guild.id, (conf) => {
                    conf.blacklisted = []
                })
                .then(() => {
                    embed.setTitle("Completed")
                    embed.setDescription(`blacklisted words cleard`)
                    message.channel.send(embed)
                })
                break;
            case "delete":
                setServerConfig(message.guild.id, (conf) => {
                    if (conf.blacklisted.includes(args[1])) {
                        conf.blacklisted = conf.blacklisted.filter(word => word != args[1])
                        embed.setTitle("Completed")
                        embed.setDescription(`deleted word ${args[1]} from the blacklisted words`)
                    } else {
                        embed.setTitle("Fail")
                        embed.setDescription(`word ${args[1]} doesnt exist in the blacklisted words`)
                    }
                })
                .then(() => {
                    message.channel.send(embed)
                })
                break;
            case "add":
                if (!args[1]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
                const blword = args[1].replace(/^`\S+|`+$/gm, "").trim();
                setServerConfig(message.guild.id, (conf) => {
                    conf.blacklisted.push(blword)
                })
                .then(() => {
                    embed.setTitle("Completed")
                    embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    embed.setDescription(`added ${(/^\/.*\/$/.test(blword)) ? "regex" : "word"} "${blword}" to the blacklisted words`)
                    message.channel.send(embed)
                })
                break;
            default:
                helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
                break;
        }
    }
} as Command
