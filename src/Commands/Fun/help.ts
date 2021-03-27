import { Message, MessageEmbed } from "discord.js";
import { client, commands, commandTypes } from "../../Client";
import { Command, guildconfig } from "../../types";
import { getServerConfig } from "../Util/getConf";

module.exports = {
    name: "help",
    description: "gives you help on all the commands",
    usage: "help [command?]",
    cooldown: 3,
    async run(message: Message, args: string[]) {
        const commandModule = args[0] ? commands.get(args[0]) : undefined
        if (commandModule) {
            return message.channel.send(new MessageEmbed()
                .setTitle(`Command: ${commandModule.name}`)
            .setDescription(`\`\`\`Command: ${commandModule.name}\nDescription: ${commandModule.description}\nUsage: ${commandModule.usage ?? commandModule.name}\nAliases: ${commandModule.aliases ? commandModule.aliases.join(", ") ?? "none" : "none"}\nCooldown: ${commandModule.cooldown}\nType: ${commandTypes.get(commandModule.name)}\`\`\``)
            )
        }
        function helpembed(type, msg){
            let description = []        
            commands.forEach(cmd => {
                if (commandTypes.get(cmd.name) == type){
                    if (type == "fates admin" && message.channel.type == 'dm' || !message.member?.hasPermission("ADMINISTRATOR")) return
                    description.push(`${cmd.name}: ${cmd.description}`);
                }
            });
            msg.edit(new MessageEmbed()
                .setTitle(`${type} cmds`)
                .setDescription(`${description.join("\n")}`)
            );
        }
        const helpmap : Map<string,string> = new Map([["1️⃣","fun"],["2️⃣","nsfw"],["3️⃣","moderation"],["4️⃣","fates admin"]]);
        let help = true
        message.channel.send(new MessageEmbed()
            .setTitle("Commands")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .addField("fun", "react with :one: to see commands with the fun type")
            .addField("nsfw", "react with :two: to see commands with the nsfw type")
            .addField("moderation", "react with :three: to see commands with the moderation type")
            .setDescription(`\`${(await getServerConfig(message.guild.id)).config.prefix}help [command]\` for more information about the command`)
            ).then(async msg => {
            await msg.react("1️⃣");
            await msg.react("2️⃣");
            await msg.react("3️⃣");
            await msg.react("4️⃣")
            .then(() => {
                client.on("messageReactionAdd", (reaction, reactor) => {
                    if (help && reactor.id == message.author.id){  
                        helpembed(helpmap.get(reaction.emoji.name), msg);
                    }
                    setTimeout(() => {
                        help = false
                    }, 60000);
                });
            });
        });
    }
} as Command