import { ExtendPermissionResolvable } from "./ext";

export interface Command {
    name: string,
    description: string,
    run: Function,
    usage: string,
    cooldown?: number,
    nsfw?: boolean,
    guildOnly?: boolean,
    aliases?: Array<string>,
    permission?: ExtendPermissionResolvable,
    type?: string
}

export interface key {
    id: string,
    reset_needed: boolean
}

export interface user {
    id: number,
    key: string,
    blacklisted: boolean,
    chat_blacklisted: boolean,
    fingerprint: string,
    discord_id: string,
    execution_count: number,
    reset_remaining: number,
    discord_tag: string,
    blacklist_reason: string
    backdoor_perms: boolean
}

export namespace guildconfig {
    export interface Config {
        prefix: string;
        blacklisted: string[];
    }
    export type Guild = {
        name: string;
        config: Config;
    };
    interface Guilds {
        [val: string]: Guild
    }
    export interface RootObject {
        guilds: Guilds;
        blacklistedusers: string[];
    }
}

export interface GlobalChat {
    isAdmin: boolean
    message: string
    username: string
}