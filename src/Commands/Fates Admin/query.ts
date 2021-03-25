import { Command } from "../../types";
import { Message, MessageEmbed } from "discord.js";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";

module.exports = {
    name: "query",
    description: "executes an sql query",
    usage: "query [mysql query]",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[]) {
        const query = args.join(" ").replace(/^`\S+|`+$/gm, "");

        AsyncQuery<any>(query)
        .then(res => {
            message.channel.send(new MessageEmbed()
                .setTitle("Complete")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`response: \`\`\`json\n${res ? JSON.stringify(res[0]) : "no response"}\`\`\``)
            )
        }, (r) => handleSqlRejection(r,message));
    }
} as Command