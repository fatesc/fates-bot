import { Message } from "discord.js";

module.exports = {
    name: "mute",
    description: "mutes a user",
    usage: "mute [user]",
    permission: ["Mod"],
    run(message: Message, args: string[]) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!Target) return message.channel.send("invalid command usage");

        const muteRole = message.guild.roles.cache.find(role => role.name.toLowerCase() == "muted");

        Target.roles.add(muteRole).then(member => {
            message.channel.send(`muted ${member.user.tag}`);
        }, reject => {
            message.channel.send(`couldnt mute ${Target.user.tag}`);
        });
    }
}