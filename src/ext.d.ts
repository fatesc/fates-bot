import {MessageAdditions, MessageOptions, WebhookMessageOptions} from "discord.js";
type Opts = MessageOptions | WebhookMessageOptions | MessageAdditions | string | undefined
declare module "discord.js" {
	interface Message {
		inlineReply(content:string,options: Opts) :Message
		inlineReply(options:Opts) :Message
	}
}