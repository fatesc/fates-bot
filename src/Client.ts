import { Client, Collection, Intents } from "discord.js"
import { readdir, stat, writeFileSync } from "fs"
import { join } from "path";
import { ConnectionOptions } from "mysql2"
import { createPool } from "mysql2/promise"

require("dotenv").config({ path: join(__dirname, "../.env") });

const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);
const client : Client = new Client({ ws: { intents } });
const commands : Collection<String, any> = new Collection();
const commandTypes : Map<String, any> = new Map();

require('./extend/idx') // just extend standard structures

function deepsearch(folder, callback) {
    readdir(folder, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
            const filepath = join(folder, file);
            stat(filepath, (err, stat) => {
                if (stat.isDirectory()){
                    deepsearch(filepath, callback);
                } else if (stat.isFile() && file.endsWith(".js")){
                    callback(filepath);
                }
            });
        });
    });
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

    const config = await import("./config.json");

    const ids = client.guilds.cache.map(guild => guild.id).filter(id => !Object.keys(config.guilds).includes(id));

    for (const id of ids) {
        const guild = await client.guilds.fetch(id, true, true);
        const newServer = {
            [id]: ({...(config).guilds["0"]})
        }
        newServer[id].name = guild.name
        writeFileSync(__dirname + "/config.json", JSON.stringify(Object.assign(config, newServer)));
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




