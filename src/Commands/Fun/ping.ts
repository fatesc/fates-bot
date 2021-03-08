import { Message, MessageEmbed } from "discord.js";
import { client } from "../../Client";
import { timeConversion } from "../Util/timeConversion";

module.exports = {
    name: "ping",
    usage: "ping",
    description: "shows the bot's ping",
    cooldown: 3,
    run(message: Message) {
        message.channel.send(new MessageEmbed()
            .setTitle("Ping :ping_pong:")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Latency: \`${message.createdTimestamp - Date.now()} ms\`\nClient: \`${client.ws.ping} ms\`\nUptime: \`${timeConversion(client.uptime)}\``)
        )
    }
} as Command