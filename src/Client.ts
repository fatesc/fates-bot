import { Client, Collection, Intents } from "discord.js"
import { readdir, stat } from "fs"
import { join } from "path";
import { MongoClient } from "mongodb";

require("dotenv").config({ path: join(__dirname, "../.env") });

const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);
const client : Client = new Client({ ws: { intents } });
const commands : Collection<String, any> = new Collection();
const commandTypes : Map<String, any> = new Map();

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
    const type = file.split("\\")[file.split("\\").length - 2]
    if (type == "Util") return;
    const command = require(file);
    commands.set(command.name, command);
    commandTypes.set(command.name, command.type ?? type.toLowerCase());
    console.log(`${command.name ?? file.split("\\")[file.split("\\").length - 1]} (${commandTypes.get(command.name)}) is ready!`);
});

client.on("ready", () => {
    console.log(`${client.user.tag} is ready ✔`);
    client.user.setActivity("fates admin", {type: "PLAYING"});
    deepsearch(join(__dirname + "/Events/"), (file) => {
        require(file).default();
    })
});

export const mongo_client = new MongoClient(process.env.MONGOURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

client.login(process.env.OLDTOKEN);

export { client, commands, commandTypes } 

