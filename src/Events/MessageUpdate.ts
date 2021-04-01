import { PartialMessage } from "discord.js";
import { Message } from "discord.js";
import { client } from "../Client";
import { checkMessage } from "./Message"

export default function() {
    client.on("messageUpdate", (beforemsg: Message|PartialMessage, aftermsg: Message|PartialMessage) => checkMessage(aftermsg));
}