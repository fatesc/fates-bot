import { Command } from "../../types";
import { Message, MessageAttachment } from "discord.js";
import { helpCommand } from "../Util/HelpCommand";
import fetch from "node-fetch";
import { Beautify, Minify, Uglify } from "../../Modules/luamin"

module.exports = {
    name: "luamin",
    description: "beautifies your lua script!",
    aliases: ["beautify"],
    usage: "luamin [beautify/minify/uglify] [script]",
    cooldown: 3,
    async run(message: Message, args: string[]) {
        if (!args[0]||!args[1]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        const option = args[0]
        args.shift();
        const fileAttachment = message.attachments.first();
        let script = fileAttachment ? await (await fetch(fileAttachment.attachment.toString())).text() : args.join(" ");
        script = script.replace(/^`\S+|`+$/gm, "");

        const send = (fileName: string, fileContent: string): Promise<Message> | Message => {
            return message.inlineReply(new MessageAttachment(Buffer.from(fileContent), fileName));
        }

        let output: string

        switch (option) {
            case "beautify":    
                try {
                    output = Beautify(script, { RenameGlobals: false, RenameVariables: false, SolveMath: true });
                } catch (err) {
                    message.inlineReply(`\`\`\`\nerror while attempting to beautify: ${err}\`\`\``);
                    break
                }
                send("beautified.txt", output);                
                break;
            case "minify":
                try {
                    output = Minify(script, { RenameGlobals: false, RenameVariables: false, SolveMath: true });
                } catch (err) {
                    message.inlineReply(`\`\`\`\nerror while attempting to minify: ${err}\`\`\``);
                    break;
                }
                send("minified.txt", output);
                break;
            case "uglify":
                try {
                    output = Uglify(script, { RenameGlobals: false, RenameVariables: false, SolveMath: true });
                } catch (err) {
                    message.inlineReply(`\`\`\`\nerror while attempting to uglify: ${err}\`\`\``);
                    break;
                }
                send("uglified.txt", output);
                break;
            default:
                try {
                    output = await Beautify(script, { RenameGlobals: false, RenameVariables: false, SolveMath: true });
                } catch (err) {
                    message.inlineReply(`\`\`\`\nerror while attempting to beautify: ${err}\`\`\``);
                    break;
                }
                send("beautified.txt", output);
                break;
        }
        
    }
} as Command