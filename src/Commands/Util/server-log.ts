import { MessageEmbed, Message } from "discord.js";
import { Command } from "../../types";
import { sendMessagetoGuild } from "./sendMessagetoGuild";

export function logCommand(command: Command, message: Message, args: string[]): Promise<void|Error> {
    return new Promise((res, rej) => {
        // fates admin guild id and channel: "bot-logs" channel id
        sendMessagetoGuild("769988189762486302", "820387908186931210", new MessageEmbed()
            .setTitle(command.name)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Command **${command.name}** was used in <#${message.channel.id}> by ${message.member} with args \`${args.join(" ") != " " ? args.join(" ") : 'none'} \``)
            .setFooter(`Message Id: ${message.id}`)
            .setTimestamp()
        )
        .then(() => res())
        .catch(r => rej(new Error(r)))
    })
}