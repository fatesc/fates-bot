import { MessageEmbed } from "discord.js";
import { Message } from "discord.js"
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { Command } from "../../types";
import { RandStrc, chinesechars } from "../Util/ChineseGen";  
import { helpCommand } from "../Util/HelpCommand";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";
import {ScriptText} from "../Util/lazy";

module.exports = {
    name: "whitelist",
    description: "whitelists a user for them to use fates admin",
    usage: "whitelist [user] [hwid/whitelist]",
    permission: "ADMINISTRATOR",
    aliases: ["wl"],
    guildOnly: true,
    run(message: Message, args: string[], db: PoolConnection) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const whitelist = args[1] && args[1].length == 64 ? args[1] : undefined
        const key = RandStrc(12,chinesechars);
        if (!whitelist || !Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        
        AsyncQuery<ResultSetHeader>("INSERT INTO whitelist.user(`key`,`fingerprint`,`discord_id`,`discord_tag`) VALUES(?,?,?,?)",
            [key, whitelist, Target.user.id, Target.user.tag]
        ).then(res => {
            if (res.affectedRows >= 1) {
                Target.roles.add(message.guild.roles.cache.find(role => role.name.toLowerCase() == "buyer"))
                .then(m => {
                    m.send(new MessageEmbed()
                        .setTitle("Whitelisted")
                        .setAuthor(Target.user.username, Target.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`your fate's admin key is \`${key}\`, use this key for the script in <#769997572470996992>\nHeres the script.\n${ScriptText.replace('KEY_HERE',key)}`)
                    ).then(() => {
                        message.channel.send(new MessageEmbed()
                            .setTitle("Whitelisted")
                            .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`${Target} is whitelisted`)
                        );
                    }, r => {
                        message.channel.send(`${Target}, turn on dms for this server and do the \`showkey\` if you want to see your key`, {
                            embed: new MessageEmbed()
                            .setTitle("Whitelisted")
                            .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`${Target} is whitelisted but i couldnt send them their key`)
                        });
                    });
                });
            }
        }, (r) => handleSqlRejection(r,message));
    }
} as Command