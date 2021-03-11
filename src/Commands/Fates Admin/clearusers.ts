import { Message } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";

module.exports = {
    name: "clearusers",
    description: "clears the users that are whitelisted but not in the server",
    usage: "clearusers",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[], db: MongoClient) {
        const database = db.db("fates-admin-v2");
        // message.guild.members.fetch({force: true}).then(() => {
        //     database.collection("whitelists").find({}).forEach(res => {
        //         if (!message.guild.members.cache.get(res.discord_id)) {
        //             console.log(res.discord_id, res.discord_tag);
        //         }
        //     })
        // })
    }
} as Command