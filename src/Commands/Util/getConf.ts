import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { guildconfig } from "../../types";

export function getFullConfig(): Promise<guildconfig.RootObject> {
    return new Promise(async (res, rej) => {
        const config: guildconfig.RootObject = JSON.parse(await readFile(join(__dirname, "../../../config.json"), "utf8"))
        res(config)
    })
}

export function getServerConfig(serverid: string): Promise<guildconfig.Guild> {
    return new Promise(async (res, rej) => {
        getFullConfig().then(config => {
            if (!config.guilds[serverid]) return rej("no server found")
            return res(config.guilds[serverid])
        })
    })
}


export function setServerConfig(serverid: string, func: (param: guildconfig.Config) => void): Promise<guildconfig.Config> {
    return new Promise(async (res, rej) => {
        const server: guildconfig.Guild = {...((await getServerConfig(serverid)))}
        const serverconf = server.config
        try {
            func(serverconf);
        } catch (err) {
            rej(err);
        }
        getFullConfig()
        .then(config => {
            writeFile(join(__dirname, "../../../config.json"), JSON.stringify({ guilds: {...Object.assign(config.guilds, {[serverid]: server})}, blacklistedusers: config.blacklistedusers }))
            .then(async () => res((await getServerConfig(serverid)).config))
        })
    })
}