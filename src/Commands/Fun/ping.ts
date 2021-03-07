import { Message, MessageEmbed } from "discord.js";
import { client } from "../../Client";

module.exports = {
    name: "ping",
    usage: "ping",
    description: "shows the bot's ping",
    cooldown: 3,
    run(message: Message) {
        message.channel.send(new MessageEmbed()
            .setTitle("Ping :ping_pong:")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Latency: \`${message.createdTimestamp - Date.now()} ms\`\nClient: \`${client.ws.ping} ms\`\nUptime: \`${(client.uptime / 1000).toFixed(1)} s\``)
        )
    }
} as Command