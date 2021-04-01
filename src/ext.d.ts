import { PermissionString, BitFieldResolvable, PermissionResolvable } from "discord.js";
import {MessageAdditions, MessageOptions, WebhookMessageOptions} from "discord.js";
type Opts = MessageAdditions | APIMessageContentResolvable | (MessageOptions & { split?: false; })
type ExtendPermissionResolvable = BitFieldResolvable<PermissionString | 'OWNER'> | Array<string>
declare module "discord.js" {
	interface Message {
		inlineReply(content:string,options: Opts) :Message
		inlineReply(options:Opts) :Message
	}
	interface GuildMember {
		hasPermission(permission: ExtendPermissionResolvable, options?: {
			checkAdmin?: boolean;
			checkOwner?: boolean;
		}): boolean
	}
}
export { Opts, ExtendPermissionResolvable }