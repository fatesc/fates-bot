import { Client, Collection, Intents } from "discord.js"
import { readdir, stat } from "fs/promises"
import { join } from "path";
import { Command } from "./types";

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

deepsearch(join(__dirname + "/Events/"), (file) => {
    require(file).default();
    console.log(`Event ${(file.split("\\")[file.split("\\").length - 1] ?? file.split("/")[file.split("/").length - 1]).replace(/\.js/,"")} is ready!`);
});


export { client, commands } 

export default client


