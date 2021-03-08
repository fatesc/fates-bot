import { GuildMember, MessageEmbed } from "discord.js";
import { client, mongo_client } from "../Client";

export default function() {
    client.on("guildMemberAdd", (member: GuildMember) => {
        const database = mongo_client.db("fates-admin-v2").collection("whitelists");
        
        database.findOne({ discord_id: member.user.id }, (err, res) => {
            if (res) {
                database.findOneAndUpdate({ discord_id: member.user.id }, {$set:{blacklisted:false,reason:null}}, (err, res) => {
                    member.roles.add(member.guild.roles.cache.find(role => role.name.toLowerCase() == 'buyer'))
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
                });
            }
        });
    });
}