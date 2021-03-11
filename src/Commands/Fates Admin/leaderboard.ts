import { Client, Message } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";
import { newembed } from "../Util/EmbedGen";

module.exports = {
    name: "executionleaderboard",
    description: "shows you the top 10 users who has executed fates admin the most",
    usage: "executionleaderboard",
    aliases: ["elb"],
    cooldown: 30,
    guildOnly: true,
    run(message: Message, args: string[], db: MongoClient){
        const database = db.db("fates-admin-v2");
        const top5 = database.collection("whitelists").find({}).sort({execution_count:-1}).limit(10)
        const highest = []
        top5.forEach(a => {
            highest.push(`${highest.length+1}. ${a.discord_tag} - \`${a.execution_count}\``);
        }).then(() => {
            newembed(message.channel, "Top 10 executions on fates admin", highest.join("\n"));
        })
    }
} as Command