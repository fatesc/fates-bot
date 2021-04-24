// fuck i need to redo this LOL

import { readFile, stat, writeFile } from "fs/promises";
import { join } from "path";
import { client } from "../Client";
import { guildconfig } from "../types";

export async function setConfig() {
    const config: guildconfig.RootObject = JSON.parse(await readFile(join(__dirname, "../../config.json"), "utf8"))
    
    const ids = client.guilds.cache.map(guild => guild.id).filter(id => !Object.keys(config.guilds).includes(id));

    for (const id of ids) {
        const guild = await client.guilds.fetch(id, true, true);
        const newServer = {
            [id]: ({...(config).guilds["0"]})
        }
        newServer[id].name = guild.name
        
        writeFile(join(__dirname, "../../config.json"), JSON.stringify({ guilds: {...Object.assign(config.guilds, newServer)}, blacklistedusers: config.blacklistedusers }))
        .catch(err => console.error(err));
    }
}

export default function() {
    client.on("ready", async () => {
        console.log(`${client.user.tag} is ready ✔`);
        client.user.setActivity("fates admin", {type: "PLAYING"});

        await stat(join(__dirname, "../../config.json"))
        .catch(err => {
            readFile(join(__dirname, "../../config.template.json"), "utf8")
            .then(res => {
                writeFile(join(__dirname, "../../config.json"), res).then(() => {
                    console.log("config created");
                    setConfig();
                });
            })
        })
        .then(() => setConfig());
    });
}