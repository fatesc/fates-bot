import { Message, MessageEmbed, TextChannel, DMChannel, NewsChannel } from "discord.js";

export function newembed(message: TextChannel|DMChannel|NewsChannel, title: string, description: string, image?: string, footer?: {text: any, iconUrl: string}, timestamp?: number|Date) {
    const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setFooter(footer.text, footer.iconUrl)
    .setImage(image)
    .setTimestamp(timestamp)
    message.send(embed);
}