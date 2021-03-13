import { client } from "../../Client";
import { Opts } from "../../ext";

export function sendMessagetoGuild(guildid: string, channelid: string, message: Opts): Promise<void|Error> {
    return new Promise((res, rej) => {
        client.guilds.fetch(guildid, true, true)
        .then(guild => {
            const channel = guild.channels.cache.get(channelid);
            if (channel.isText()) {
                channel.send(message)
                .then(r => res())
                .catch(r => rej(new Error(r)))
            }
        }).catch(() => rej())
    })
}