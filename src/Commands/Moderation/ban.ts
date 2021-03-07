import { Message } from "discord.js";

module.exports = {
    name: "ban",
    description: "bans a member",
    usage: "ban [user] [?reason]",
    permission: "BAN_MEMBERS",
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ");
        if (!Target) return message.channel.send("invalid command usage");

        Target.ban({reason}).then(member => {
            message.channel.send(`banned ${member.user.tag}`);
        }, reject => {
            message.channel.send(`couldnt ban ${Target.user.tag}`);
        });
    }
}