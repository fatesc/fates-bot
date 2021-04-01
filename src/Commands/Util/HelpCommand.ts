import { Message, MessageEmbed } from "discord.js"
import { commands } from "../../Client"

export function helpCommand(message: Message, command: string, additional?: string) {
    const commandModule = commands.get(command)
    if (commandModule) {
        return message.channel.send(additional ?? "", {
            embed: new MessageEmbed()
                .setTitle(`Command: ${commandModule.name}`)
                .setDescription(`\`\`\`Command: ${commandModule.name}\nDescription: ${commandModule.description}\nUsage: ${commandModule.usage ?? commandModule.name}\nAliases: ${commandModule.aliases ? commandModule.aliases.join(", ") ?? "none" : "none"}\nCooldown: ${commandModule.cooldown ?? "none"}\nType: ${commandModule.type}\`\`\``)
        });
    }
}