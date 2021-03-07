import { GuildMember, Message, MessageEmbed } from "discord.js";
import { MongoClient } from "mongodb";
import { RandStrc, chinesechars } from "../Util/ChineseGen";  
import { helpCommand } from "../Util/HelpCommand";


module.exports = {
    name: "whitelist",
    description: "whitelists a user for them to use fates admin",
    usage: "whitelist [user] [hwid/whitelist]",
    permission: ["Support", "ADMINISTRATOR"],
    aliases: ["wl"],
    guildOnly: true,
    run(message: Message, args: string[], db: MongoClient) {
        const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const whitelist = args[1] && args[1].length == 64 ? args[1] : undefined
        const key = RandStrc(12,chinesechars);
        if (!whitelist || !Target) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);

        const database = db.db("fates-admin-v2");

        const toInsert = {
            fingerprint: whitelist,
            key: key,
            discord_id: Target.user.id,
            discord_tag: Target.user.tag,
            execution_count: 0,
        }
        function add() {
            database.collection("whitelists").insertOne(toInsert, (err, res) => {
                if (err) throw err;
                if (res.ops[0].fingerprint == whitelist) {
                    Target.roles.add(message.guild.roles.cache.find(role => role.name.toLowerCase() == "buyer"))
                    .then(m => {
                        m.send(new MessageEmbed()
                            .setTitle("Whitelisted")
                            .setAuthor(Target.user.username, Target.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`your fate's admin key is \`${key}\``)
                        ).then(() => {
                            message.channel.send(new MessageEmbed()
                                .setTitle("Whitelisted")
                                .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({ dynamic: true }))
                                .setDescription(`${Target} is whitelisted`)
                            );
                        }, r => {
                            message.channel.send(`${Target}, turn on dms for this server and do the \`showkey\` if you want to see your key`, {
                                embed: new MessageEmbed()
                                .setTitle("Whitelisted")
                                .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({ dynamic: true }))
                                .setDescription(`${Target} is whitelisted but i couldnt send them their key`)
                            });
                        });
                    });
                } else {
                    add();
                }
            });
        }
        add();
    }
} as Command