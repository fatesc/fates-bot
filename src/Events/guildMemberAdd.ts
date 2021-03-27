import { GuildMember, MessageEmbed } from "discord.js";
import { ResultSetHeader } from "mysql2";
import { client } from "../Client";
import { AsyncQuery } from "../Commands/Util/Query";
import { user } from "../types";

export default function() {
    client.on("guildMemberAdd", (member: GuildMember) => {
        
        AsyncQuery<Array<user>|Array<[]>>("SELECT * FROM whitelist.user WHERE discord_id = ?",[member.user.id])
        .then(res => {
            if (res && res[0]) {
                AsyncQuery<ResultSetHeader>("UPDATE whitelist.user SET blacklisted = ?, blacklist_reason = ? WHERE discord_id = ?",
                    [0, null, member.user.id]
                ).then(res => {
                    if (res?.affectedRows >= 1) {
                        member.roles.add(member.guild.roles.cache.find(role => role.name.toLowerCase() == 'buyer'), "restoring whitelist from user joining")
                        .then(m => {
                            m.send("your whitelist has been added back");
                            client.guilds.fetch("769988189762486302", true, true)
                            .then(guild => {
                                const channel = guild.channels.cache.get("769994308316692570")
                                if (channel.isText()) {
                                    channel.send(new MessageEmbed()
                                        .setTitle("Whitelist Restored!")
                                        .setDescription(`${member.user.tag} has joined the server, their whitelist has been added back.`)
                                    );
                                }
                            });
                        });
                    }
                });
            }
        });
    });
}