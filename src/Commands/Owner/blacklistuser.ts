import { MessageEmbed } from "discord.js";
import { Guild } from "discord.js";
import { Message } from "discord.js";
import { writeFile } from "fs/promises";
import { join } from "path";
import { Command } from "../../types";
import { getFullConfig } from "../Util/getConf";

module.exports = {
    name: "blacklistuser",
    description: "blacklists a user from using commands",
    usage: "blacklistuser [user]",
    aliases: ["bluser"],
    async run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const config = {...await getFullConfig()}
        config.blacklistedusers.push(Target.user.id);
        writeFile(join(__dirname, "../../../config.json"), JSON.stringify({ guilds: config.guilds, blacklistedusers: config.blacklistedusers }))
        .then(() => message.channel.send(new MessageEmbed()
            .setTitle("Blacklisted")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${Target} is now blacklisted from using commands or anything to do with the bot`)
        ))
        
    }
} as Command