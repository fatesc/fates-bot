import { Command } from "../../types";
import { Message, MessageAttachment } from "discord.js";
import { helpCommand } from "../Util/HelpCommand";
import fetch from "node-fetch";
import luamin from "../../Modules/luamin"

module.exports = {
    name: "luamin",
    description: "beautifies your lua script!",
    aliases: ["beautify"],
    usage: "luamin [beautify/minify/uglify]",
    cooldown: 3,
    async run(message: Message, args: string[]) {
        if (!args[0]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        const option = args[0]
        args.shift();
        const fileAttachment = message.attachments.first()

        const script = fileAttachment ? await (await fetch(fileAttachment.attachment.toString())).text() : args.join(" ");

        switch (option) {
            case "beautify":
                message.channel.send(new MessageAttachment(Buffer.from(luamin.Beautify(script, {SolveMath:true,RenameVariables:false,RenameGlobals:false}).toString()), "beautified.txt"))
                break;
            case "minify":
                message.channel.send(new MessageAttachment(Buffer.from(luamin.Minify(script, {SolveMath:true,RenameVariables:false,RenameGlobals:false}).toString()), "minified.txt"))
                break;
            case "uglify":
                message.channel.send(new MessageAttachment(Buffer.from(luamin.Uglify(script, {SolveMath:true,RenameVariables:false,RenameGlobals:false}).toString()), "uglified.txt"))
                break;
                        
        }
    }
} as Command