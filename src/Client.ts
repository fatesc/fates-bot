import { Client, Collection, Intents } from "discord.js"
import { readdir, readFile, stat, writeFile } from "fs/promises"
import { join } from "path";
import { Command, guildconfig } from "./types";

require("dotenv").config({ path: join(__dirname, "../.env") });

const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);
const client = new Client({ ws: { intents } });
const commands : Collection<String, Command> = new Collection();

require('./extend/idx') // just extend standard structures

function deepsearch(folder: string, callback: (file: string) => void) {
    readdir(folder)
    .then(files => {
        files.forEach(file => {
            const filepath = join(folder, file);
            stat(filepath)
            .then(stats => {
                if (stats.isDirectory()) return deepsearch(filepath, callback);
                if (stats.isFile() && file.endsWith(".js")) {
                    callback(filepath);
                }
            })
            .catch(err => console.error(err))
        });
    })
    .catch(err => console.error(err))
}

deepsearch(join(__dirname + "/Commands/"), (file) => {
    let type = file.split("\\")[file.split("\\").length - 2] ?? file.split("/")[file.split("/").length - 2] // adding so i can run on linux aswell
    if (type == "Util") return;
    const command = require(file);
    commands.set(command.name, {...command, type: type.toLowerCase()});
    console.log(`${command.name ?? file.split("\\")[file.split("\\").length - 1]} (${type}) is ready!`);
});

client.on("ready", async () => {
    console.log(`${client.user.tag} is ready ✔`);
    client.user.setActivity("fates admin", {type: "PLAYING"});
    deepsearch(join(__dirname + "/Events/"), (file) => {
        require(file).default();
        console.log(`Event ${(file.split("\\")[file.split("\\").length - 1] ?? file.split("/")[file.split("/").length - 1]).replace(/\.js/,"")} is ready!`);
    });

    await stat(join(__dirname, "../config.json"))
    .catch(err => {
        readFile(join(__dirname, "../config.template.json"), "utf8")
        .then(res => {
            writeFile(join(__dirname, "../config.json"), res)
            console.log("config created")
        })
    })
    .then(async () => {
        const config: guildconfig.RootObject = JSON.parse(await readFile(join(__dirname, "../config.json"), "utf8"))

        const ids = client.guilds.cache.map(guild => guild.id).filter(id => !Object.keys(config.guilds).includes(id));
    
        for (const id of ids) {
            const guild = await client.guilds.fetch(id, true, true);
            const newServer = {
                [id]: ({...(config).guilds["0"]})
            }
            newServer[id].name = guild.name
            
            writeFile(join(__dirname, "../config.json"), JSON.stringify({ guilds: {...Object.assign(config.guilds, newServer)} }))
            .catch(err => console.error(err));
        }
    })
});


export { client, commands } 

export default client


