import { GuildMember, MessageEmbed } from "discord.js";
import { client, mongo_client } from "../Client";

export default function() {
    client.on("guildMemberRemove", (member: GuildMember) => {
        const database = mongo_client.db("fates-admin-v2").collection("whitelists");

        database.findOne({ discord_id: member.user.id }, (err, res) => {
            if (res) {
                database.findOneAndUpdate({ discord_id: member.user.id }, {$set:{blacklisted:true,reason:"you have left the server, join back to restore your whitelist (discord.gg/admin)"}}, (err, res) => {
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
                });
            }
        });
    });
}