import { MessageEmbed } from "discord.js";

export function newembed(message, title , description, image?, footer?) {
    const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setFooter(footer ?? "")
    .setImage(image)
    .setTimestamp()
    message.send(embed);
}