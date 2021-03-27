import { Client, Collection, Intents } from "discord.js"
import { readdir, readFile, stat, writeFile } from "fs/promises"
import { join } from "path";
import { ConnectionOptions } from "mysql2"
import { createPool } from "mysql2/promise"
import { guildconfig } from "./types";
import { dirname } from "node:path";
import { write } from "node:fs";

require("dotenv").config({ path: join(__dirname, "../.env") });

const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);
const client : Client = new Client({ ws: { intents } });
const commands : Collection<String, any> = new Collection();
const commandTypes : Map<String, any> = new Map();

require('./extend/idx') // just extend standard structures

function deepsearch(folder, callback) {
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
    const type = file.split("\\")[file.split("\\").length - 2] ?? file.split("/")[file.split("/").length - 2] // adding so i can run on linux aswell
    if (type == "Util") return;
    const command = require(file);
    commands.set(command.name, command);
    commandTypes.set(command.name, command.type ?? type.toLowerCase());
    console.log(`${command.name ?? file.split("\\")[file.split("\\").length - 1]} (${commandTypes.get(command.name)}) is ready!`);
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
});

const db: ConnectionOptions = {
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
}
export const sql = createPool(db)

sql.getConnection().then((connection) => {
    console.log(`connected to mysql//mariadb`);
    connection.release()
})

client.login(process.env.OLDTOKEN);

export { client, commands, commandTypes } 




