import {MessageAdditions, MessageOptions, WebhookMessageOptions} from "discord.js";
type Opts = MessageAdditions | APIMessageContentResolvable | (MessageOptions & { split?: false; })
declare module "discord.js" {
	interface Message {
		inlineReply(content:string,options: Opts) :Message
		inlineReply(options:Opts) :Message
	}
}
export { Opts }