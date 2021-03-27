export interface Command {
    name: string,
    description: string,
    run: Function,
    usage: string,
    cooldown?: number,
    nsfw?: boolean,
    guildOnly?: boolean,
    aliases?: Array<string>,
    permission?: string | Array<string>
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
        blacklistedWords: string[];
    }
    export interface Guild {
        [x: string]: any;
        name: string;
        config: Config;
    }
    export type Guilds = Guild[]
    export interface RootObject {
        then(arg0: (conf: any) => void);
        guilds: Guilds;
    }
}
