import { Command } from "../../types";
import { Message, MessageEmbed } from "discord.js";
import { helpCommand } from "../Util/HelpCommand";
import { setServerConfig } from "../Util/getConf";

module.exports = {
    name: "setprefix",
    usage: "setprefix [prefix]",
    description: "sets the prefix for the guild",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[]) {
        const newPrefix = args[0]
        if (!new RegExp(/[^\p{L}\d\s]/ug).exec(newPrefix)) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        setServerConfig(message.guild.id, (conf) => {
            conf.prefix = newPrefix
        })
        .then(res => {
            message.channel.send(new MessageEmbed()
                .setTitle("Completed")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Prefix has changed to ${res.prefix}`)
            )
        })
    }
} as Command