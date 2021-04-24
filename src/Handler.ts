import { MessageEmbed } from "discord.js";
import { GuildMember, Message } from "discord.js";
import { PoolConnection } from "mysql2/promise"
import { isOwner } from "./Commands/Util/isOwner";
import { sendMessagetoGuild } from "./Commands/Util/sendMessagetoGuild";
import { logCommand } from "./Commands/Util/server-log";
import { ExtendPermissionResolvable } from "./ext";
import { Command } from "./types";

const cooldowns : Map<String,Map<String,any>> = new Map(); 

function adminCheck(user: GuildMember) {
    const adminRoles = ["Mod", "Support", "Administrator", "Owner", "Co Owner"]
    return user.hasPermission("ADMINISTRATOR") || user.roles.cache.some(role => adminRoles.includes(role.name));
}

function runCommand(command: Command, message: Message, args: string[], db?: PoolConnection) {
    if (!command) return

    if (command.type == "fates admin" && !isOwner(message.member)) return

    message.channel.startTyping(2);
    setTimeout(() => {
        message.channel.stopTyping(true);
    }, 2000);

    if (command.permission == "OWNER" && !isOwner(message.member)) 
        return message.channel.send(`you dont have enough permission to run this command ${message.member}`)
    
    if (command.nsfw && message.channel.type == 'text' && !message.channel.nsfw)
        return message.channel.send(`this command is nsfw command only ${message.member}`);
    
    if (command.guildOnly && message.channel.type == 'dm') 
        return message.channel.send(`this command is not allowed to be sent in dms ${message.member}.`);
    
    if (command.permission){
        if (typeof(command.permission) == 'string' && !message.member.hasPermission(command.permission)) {
            return message.channel.send(`you dont have enough permission to run this command ${message.member}`);
        }
        else if (typeof(command.permission) == 'object' && !message.member.roles.cache.some(role => (<Array<ExtendPermissionResolvable|string>>command.permission).includes(role.name)) && !message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(`you dont have enough permission to run this command ${message.member}`);
        }
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const commandTimeouts = cooldowns.get(command.name);
    const cooldown = (command.cooldown ?? 0) * 1000;

    if (commandTimeouts.has(message.author.id)) {
        const expirationTime = commandTimeouts.get(message.author.id) + cooldown;
        if (now < expirationTime) {
            message.channel.stopTyping(true);
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`you are on a ${timeLeft.toFixed(1)} cooldown`).then(msg => setInterval(() => {
                message.delete();
                msg.delete();
            }, 10e3));
        }
    }

    if (command.permission) {
        logCommand(command, message, args)
        .catch(err => console.error(err));
    }

    try {
        command.run(message, args, db);
        commandTimeouts.set(message.author.id, now);
        setTimeout(() => commandTimeouts.delete(message.author.id), cooldown);
        message.channel.stopTyping(true);
    } catch (err) {
        sendMessagetoGuild("769988189762486302", "820387908186931210", new MessageEmbed()
            .setTitle("Error")
            .setDescription(`error executing ${command.name}: \`\`\`${err}\`\`\``)
            .setFooter(`Message Id ${message.id}`)
            .setTimestamp()
        )
    }
}

export { adminCheck, runCommand }