import { Message, MessageEmbed } from "discord.js";
import { client, commands } from "../../Client";
import { Command } from "../../types";
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
                .setDescription(`\`\`\`Command: ${commandModule.name}\nDescription: ${commandModule.description}\nUsage: ${commandModule.usage ?? commandModule.name}\nAliases: ${commandModule.aliases ? commandModule.aliases.join(", ") ?? "none" : "none"}\nCooldown: ${commandModule.cooldown}\nType: ${commandModule.type}\`\`\``)
            )
        }
        function helpembed(type: string, msg: Message): Message {
            const filterCommands = commands.filter(command => command.type == type).map(command => `${command.name}: ${command.description}`)
            if (msg.embeds[0].title.split(" ")[0] != type) {
                msg.edit(new MessageEmbed()
                    .setTitle(`${type} cmds`)
                    .setDescription(filterCommands.join("\n"))
                )
            }
            return msg
        }
        const helpmap : Map<string,string> = new Map([["1️⃣","fun"],["2️⃣","nsfw"],["3️⃣","moderation"],["4️⃣","fates admin"],["5️⃣", "owner"]]);
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
            await msg.react("5️⃣")
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

// import { MessageEmbed } from "discord.js"
// import { Message } from "discord.js"
// import { commands } from "../../Client"
// import { Command } from "../../types"

// module.exports = {
//     name: "help",
//     description: "gives you help on the current commands",
//     usage: "help [command?]",
//     cooldown: 3,
//     async run(message: Message, args: string[]) {
//         const command: Readonly<Command> = args[0] && commands.get(args[0])
//         if (command) {
//             return message.channel.send(new MessageEmbed()
//                 .setTitle(`Command: ${command.name}`)
//                 .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
//                 .setDescription(`\`\`\`Command: ${command.name}\nDescription: ${command.description}\nUsage: ${command.usage ?? command.name}\nAliases: ${command.aliases ? command.aliases.join(", ") ?? "none" : "none"}\nCooldown: ${command.cooldown}\nType: ${command.type}\`\`\``)
//             )
//         }
//         let commandTypes: string[] = commands.map(x => x.type)
//         commandTypes = commandTypes.filter((v,i) => commandTypes.indexOf(v) == i).sort((a,b) => b.length - a.length);
//         const embed = new MessageEmbed()
//         embed.setTitle("Commands")
//         embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
//         commandTypes.forEach((type,i) => {
//             embed.addField(type, `react with ${i+1} to see commands with the ${type} type`)
//         })
//         message.channel.send(embed)
//         .then(msg => {
//             Array.from(helpmap).forEach(async v => {
//                 await msg.react(v[0])
//             })
//         })

//     }
// }
// const b = [["1️⃣","fun"],["2️⃣","nsfw"],["3️⃣","moderation"],["4️⃣","fates admin"],["d","owner"]].sort((a,b) => b[1].length - a[1].length);
// const helpmap : Map<string,string> = new Map(b);
// function helpembed(type: string, msg: Message): Message {
//     const filterCommands = commands.filter(command => command.type == type).map(command => `${command.name}: ${command.description}`)
//     if (msg.embeds[0].title.split(" ")[0] != type) {
//         msg.edit(new MessageEmbed()
//             .setTitle(`${type} cmds`)
//             .setDescription(filterCommands.join("\n"))
//         )
//     }
//     return msg
// }
