import { Message } from "discord.js";
import { MongoClient } from "mongodb";
import { Command } from "../../Command";

module.exports = {
    name: "users",
    description: "gives you the amount of users whitelisted in the db",
    usage: "users",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[], db: MongoClient) {
        const database = db.db("fates-admin-v2");
        database.collection("whitelists").countDocuments().then(x => {
            message.inlineReply(`${x} amount of users whitelisted`);
        });
    }
} as Command