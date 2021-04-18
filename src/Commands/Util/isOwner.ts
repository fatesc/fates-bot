import { GuildMember } from "discord.js"

const owners = ["798262622696636450"]

export const isOwner = (member: GuildMember) => owners.includes(member.id) || member.roles.cache.find(role => role.name.toLowerCase() == 'owner')
