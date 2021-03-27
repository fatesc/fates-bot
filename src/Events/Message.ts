import { Message } from "discord.js";
import { client, commands } from "../Client";
import { getServerConfig } from "../Commands/Util/getConf";
import { runCommand } from "../Handler";

function checkMessage(message: Message): Promise<boolean> { 
    return new Promise((resolve) => {
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
            res.blacklistedWords.forEach(word => {
                if (message.content.includes(word) && word.length >= 3) {
                    if (message.deletable) message.delete({ reason: `sending a blacklisted message: ${word}`})
                    .then(() => message.channel.send(`${message.member} you are sending a message which includes a blacklisted word`))
                    return resolve(true)
                }
            })
        })
        resolve(true)
    })
}


export default function() {
    client.on("message", async (message: Message) => {
        const prefix = (await getServerConfig(message.guild.id)).config.prefix
        if (message.author.bot) return
        try {
            const first = message?.mentions?.members.first()
            if (first && first.user.id == client.user.id) {
                return message.channel.send(`Prefix is \`${prefix}\``)
            }
        } catch {}
        checkMessage(message)
        .then(res => {
            if (!message.content.startsWith(prefix)) return;
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
