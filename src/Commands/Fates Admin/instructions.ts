import { Message } from "discord.js"
import { Command } from "../../types";
import { helpCommand } from "../Util/HelpCommand";

const instructions : Map<string,string> = new Map([["robux", "`STEP 1`\n Join this game: https://www.roblox.com/games/6289819792/Speed-Rush-RELEASE\n`STEP 2`\nUsing your executor, execute this script:\n```lua\ngame.ReplicatedStorage.LeaderboardTime:FireServer()```\n\nSTEP 3\nYou should now see a gamepass pop up, please buy that!\n`STEP 4`\nNow ping whoever sent you this, we will check if you have purchased it then we will whitelist you!"], ["copy", 'Alright, can you execute this ```lua\nloadstring(game:HttpGet(\"https://fate0.xyz/scripts/fates-admin/copy-hwid\"))()```\nInstructions\n```\n1) Execute that\n2) A string will be copied to your clipboard\n3) Send that to me (Required for whitelisting)```']])

module.exports = {
    name: "instructions",
    description: "gives you the instructions",
    usage: "instructions [robux/copy]",
    permission: "ADMINISTRATOR",
    guildOnly: true,
    cooldown: 3,
    run(message: Message, args: string[]){
        if (!instructions.get(args[0])) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        message.channel.send(instructions.get(args[0]));
        if (message.deletable) {
            message.delete();
        }
    }
} as Command