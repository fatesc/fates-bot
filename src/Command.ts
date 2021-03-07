interface Command {
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