import { config } from "../../types";

export function getServerConfig(serverid: string): Promise<config> {
    return new Promise<config>((res, rej) => {
        import("../../config.json").then(conf => {
            console.log(conf.guilds?.[serverid])
        })
        .catch(err => rej(err));
    })
}