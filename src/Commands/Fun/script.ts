import { Command } from "../../types";
import { Message } from "discord.js";

module.exports = {
    name: "script",
    description: "gives you the fates admin script",
    usage: "script",
    cooldown: 3,
    run(message: Message, args: string[]) {
        message.inlineReply(`\`\`\`lua\nloadstring(game:HttpGet("https://raw.githubusercontent.com/fatesc/fates-admin/main/main.lua"))();\`\`\``)
    }
} as Command