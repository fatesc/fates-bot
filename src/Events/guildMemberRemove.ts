import { PartialGuildMember } from "discord.js";
import { GuildMember, MessageEmbed } from "discord.js";
import { ResultSetHeader } from "mysql2";
import { client } from "../Client";
import { AsyncQuery } from "../Commands/Util/Query";
import { user } from "../types";

export default function() {
    client.on("guildMemberRemove", (member: GuildMember|PartialGuildMember) => {
        AsyncQuery<Array<user>|Array<[]>>("SELECT * FROM whitelist.user WHERE discord_id = ?",[member.user.id])
        .then(res => {
            if (res && res[0]) {
                AsyncQuery<ResultSetHeader>("UPDATE whitelist.user SET blacklisted = ?, blacklist_reason = ? WHERE discord_id = ?",
                    [1, "you have left the server, join back to restore your whitelist (discord.gg/admin)", member.user.id]
                ).then(res => {
                    if (res?.affectedRows >= 1) {
                        client.guilds.fetch("769988189762486302", true, true)
                        .then(guild => {
                            const channel = guild.channels.cache.get("769994308316692570")
                            if (channel.isText()) {
                                channel.send(new MessageEmbed()
                                    .setTitle("Whitelist Revoked!")
                                    .setDescription(`${member.user.tag} has left the server, their whitelist has been revoked`)
                                );
                            }
                        });
                    }
                });
            }
        });
    });
}