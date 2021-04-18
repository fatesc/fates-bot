import { PartialMessage } from "discord.js";
import { Message } from "discord.js";
import { client, commands } from "../Client";
import { getFullConfig, getServerConfig } from "../Commands/Util/getConf";
import { isOwner } from "../Commands/Util/isOwner";
import { runCommand } from "../Handler";

function checkMessage(message: Message|PartialMessage): Promise<boolean> { 
    return new Promise((resolve) => {
        if (!isOwner(message.member)) {
            const reg = new RegExp(/.gg\/|.com\/invite/gi);
            if (message.content.match(reg) && message.author.id != client.user.id) {
                if (message.deletable){
                    message.delete()
                    .then(() => {
                        message.channel.send(`${message.member} no invite links allowed.`);
                        return resolve(false)
                    })
                } else {
                    message.channel.send(`${message.member} no invite links allowed, but i couldn't delete it`);
                    return resolve(false)
                }
            }
        
            getServerConfig(message.guild.id)
            .then(res => res.config)
            .then(res => {
                let reason: Array<string> // reasons for blacklisted words will be added soon
                const has = res.blacklisted.some(e => {
                    if (e.match(/^\/.*\/$/)) return new RegExp(e.substring(1, e?.length-1), "gi").test(message.content.toLowerCase())                        
                    return message.content.toLowerCase().includes(e)
                });
                if (has) {
                    if (message.deletable) {
                        message.delete()
                        .then(() => {
                            message.channel.send(`you are sending a message that is not allowed to be sent. ${reason ? `\`\`\`Reason:\n${reason.map((v,i) => `${i+1} - ${v}`).join("\n")}` : ""}`)
                            return resolve(false)        
                        })
                    }
                }
            })
            resolve(true)
        }
        resolve(true)
    })
}


export default function() {
    client.on("message", async (message: Message) => {
        const prefix = (await getServerConfig(message.guild.id)).config.prefix
        if (message.author.bot || (await getFullConfig()).blacklistedusers.includes(message.author.id)) return
        try {
            const first = message?.mentions?.members.first()
            if (first && first.user.id == client.user.id) {
                return message.channel.send(`Prefix is \`${prefix}\``)
            }
        } catch {}
        checkMessage(message)
        .then(res => {
            if (prefix ? !message.content.startsWith(prefix) : "-") return;
            if (res) {
                message.content.slice(prefix.length).split("!!").forEach(arg => {
                    const args : any = arg.split(" ");
                    const command : any = args.shift().toLowerCase();
                    const commandModule = commands.get(command) || commands.find(a => a.aliases && a.aliases.includes(command));
                    runCommand(commandModule, message, args);
                });
            }
        })
    });
}

export { checkMessage }
