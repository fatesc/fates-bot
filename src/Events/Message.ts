import { Message } from "discord.js";
import config from "../temp-config.json"
import { MongoClient, MongoError } from "mongodb";
import { client, commands, mongo_client } from "../Client";
import { runCommand } from "../Handler";

function checkMessage(message: Message) { 
    const reg = new RegExp(/.gg\/|.com\/invite/gi);
    if (message.content.match(reg)) {
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
    mongo_client.connect((err: MongoError, res: MongoClient) => {
        if (err) {
            return console.log(`there was an error (${err.name} / ${err.code}) connecting to mongodb\n${err.message}`);
        }
        console.log(`connected to mongodb.`);
        client.on("message", (message: Message) => {
            const prefix = config.prefix
            const first = message?.mentions?.members.first()
            if (first && first.user.id == client.user.id) {
                return message.channel.send(`Prefix is \`${prefix}\``)
            }
            checkMessage(message);
            
            if (!message.content.startsWith(prefix) || message.author.bot) return;
        
            const rawargs = message.content.slice(prefix.length).split(", ");
            rawargs.forEach(arg => {
                const args : any = arg.split(" ");
                const command : any = args.shift().toLowerCase();
                const commandModule = commands.get(command) || commands.find(a => a.aliases && a.aliases.includes(command));
                runCommand(commandModule, message, args, res);
            });
        });
    });
}

export { checkMessage }
