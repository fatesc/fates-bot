import { Message } from "discord.js"
import { Command } from "../../types";
import { deletedMessages } from "../../Events/MessageDelete";

module.exports = {
    name: "snipe",
    description: "gets the most recent delted message",
    usage: "snipe [?user]/[?channel]",
    run(message: Message, args: string[]) {
        const option = message.mentions.channels.first() || message.mentions.users.first();
        const deletedMessage = option ? deletedMessages.get(option.id) : deletedMessages.last();
        message.inlineReply(deletedMessage ? `found a snipe from \`${deletedMessage.message.author.tag}\`, deleted message was \`${deletedMessage.message.content}\`, deleted ${((Date.now() - deletedMessage.time) / 1000).toFixed(1)} (s) ago ` : "no messages found to snipe");
    }
} as Command
