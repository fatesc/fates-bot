import { PartialMessage } from "discord.js";
import { Collection, Message } from "discord.js";
import { client } from "../Client";

const deletedMessages : Collection<string, any> = new Collection();

export default function() {
    client.on("messageDelete", (deltedmsg: Message|PartialMessage) => {
        const time = Date.now();
        deletedMessages.set(deltedmsg.author.id, {message: deltedmsg, time: time});
        setInterval(() => {
            deletedMessages.delete(deltedmsg.author.id);
        }, 120 * 1000);
    });
}

export { deletedMessages }