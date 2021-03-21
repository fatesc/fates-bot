import { Message } from "discord.js";
import config from "../temp-config.json"
import { client, commands } from "../Client";
import { runCommand } from "../Handler";

function checkMessage(message: Message) { 
    const reg = new RegExp(/.gg\/|.com\/invite/gi);
    if (message.content.match(reg) && message.author.id != client.user.id) {
        if (message.deletable){
            message.delete()
            .then(() => {
                return message.channel.send(`${message.member} no invite links allowed.`);
            })
        } else {
            return message.channel.send(`${message.member} no invite links allowed, but i couldn't delete it`);
        }
    }
}

export default function() {
    client.on("message", (message: Message) => {
        const prefix = config.prefix
        try {
            const first = message?.mentions?.members.first()
            if (first && first.user.id == client.user.id) {
                return message.channel.send(`Prefix is \`${prefix}\``)
            }
        } catch {}
        checkMessage(message);
        
        if (!message.content.startsWith(prefix) || message.author.bot) return;
    
        message.content.slice(prefix.length).split("!!").forEach(arg => {
            const args : any = arg.split(" ");
            const command : any = args.shift().toLowerCase();
            const commandModule = commands.get(command) || commands.find(a => a.aliases && a.aliases.includes(command));
            runCommand(commandModule, message, args);
        });
    });
}

export { checkMessage }
