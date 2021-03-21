import { Message, MessageEmbed } from "discord.js";
import { ResultSetHeader } from "mysql2";
import { Command } from "../../types";
import { user } from "../../types";
import { helpCommand } from "../Util/HelpCommand";
import { AsyncQuery } from "../Util/Query";

module.exports = { 
    name: "blacklist",
    description: "blacklists a user",
    usage: "blacklist [user] [reason]",
    permission: "ADMINISTRATOR",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target || !reason) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        AsyncQuery<ResultSetHeader>(`UPDATE whitelist.user SET blacklisted = ?, blacklist_reason = ? WHERE discord_id = ?`,
            [1, reason ?? "No Reason Provided", Target.user.id]
        )
        .then(res => {
            console.log(res);
        })
    }
} as Command
