import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";
import { user } from "../../types";
import { newembed } from "../Util/EmbedGen";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";

module.exports = {
    name: "executionleaderboard",
    description: "shows you the top 10 users who has executed fates admin the most",
    usage: "executionleaderboard",
    aliases: ["elb"],
    cooldown: 30,
    guildOnly: true,
    run(message: Message, args: string[]){
        AsyncQuery<Array<user>>("SELECT * FROM whitelist.user ORDER BY execution_count DESC LIMIT 10")
        .then(res => {
            return new Array(10).fill(null).map((v:user,i) => `${i+1}. ${res[i].discord_tag} - \`${res[i].execution_count}\``)
        }).then(highest => {
            message.channel.send(new MessageEmbed()
                .setTitle("top 10 fates admin executions")
                .setDescription(highest.join("\n"))
            );
        }, (r) => handleSqlRejection(r,message));
    }
} as Command