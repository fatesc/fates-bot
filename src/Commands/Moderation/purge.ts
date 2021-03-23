import { Message, MessageEmbed } from "discord.js"
import { parse } from "dotenv/types";
import { Command } from "../../types";

module.exports = {
    name: "purge",
    description: "deletes the amount of messages you would like",
    usage: `purge 10`,
    permission: ["Mod"],
    cooldown: 3,
    async run(message: Message, args: string[]) {
        const Amount = +args[0]
        if (isNaN(Amount)) return message.inlineReply("the first argument must be a number");
        
        if (Amount > 100) return message.inlineReply("max amount i can delete is 100");

        if (message.channel.type != 'dm') {
            await message.channel.messages.fetch({ limit: Amount + 1 });
            await message.channel.bulkDelete(Amount + 1, true);
            message.channel.send(new MessageEmbed()
                .setTitle("Complete")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`purged ${Amount + 1} messages`)
            );
        }
    }
} as Command