import { Message } from "discord.js";
import { Command } from "../../types";
import { user } from "../../types";
import { AsyncQuery, handleSqlRejection } from "../Util/Query";

module.exports = {
    name: "users",
    description: "gives you the amount of users whitelisted in the db",
    usage: "users",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[]) {
        interface res {
            [key: string]: any;
        }
        AsyncQuery<res>("SELECT COUNT(*) from whitelist.user")
        .then(res => {
            message.inlineReply(`${res[0]["COUNT(*)"]} amount of users whitelisted`);
        }, (r) => handleSqlRejection(r,message));
    }
} as Command