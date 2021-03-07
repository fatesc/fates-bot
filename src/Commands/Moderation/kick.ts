import { Message } from "discord.js";
import { memoryUsage } from "process";

module.exports = {
    name: "kick",
    description: "kicks a user",
    usage: "kick [user] [?reason]",
    permission: "KICK_MEMBERS",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target) return message.channel.send("invalid command usage");

        Target.kick(reason).then(member => {
            message.channel.send(`kicked ${member.user.tag}`);
        }, reject => {
            message.channel.send(`couldnt kick ${Target.user.tag}`);
        });
    }
}