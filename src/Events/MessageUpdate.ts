import { Message } from "discord.js";
import { client } from "../Client";
import { checkMessage } from "./Message"

export default function() {
    client.on("messageUpdate", (beforemsg, aftermsg: Message) => checkMessage(aftermsg));
}