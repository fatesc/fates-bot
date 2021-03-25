import { Command } from "../../types";
import { Message } from "discord.js";
import { helpCommand } from "../Util/HelpCommand";
import { getServerConfig } from "../Util/getConf";

module.exports = {
    name: "setprefix",
    usage: "setprefix [prefix]",
    description: "sets the prefix for the guild",
    run(message: Message, args: string[]) {
        const newPrefix = args[0]
        if (!new RegExp(/[^\p{L}\d\s]/ug).exec(newPrefix)) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        getServerConfig(message.guild.id).then(res => {
            console.log(res)
        })
    }
} as Command