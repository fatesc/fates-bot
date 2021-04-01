import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../types";
import fetch from "node-fetch"

module.exports = {
    name: "meme",
    description: "gets a meme from reddit",
    cooldown: 3,
    usage: "meme",
    run(message: Message, args: string[]) {
        const subreddits = ["memes", "dankmemes", "raimimemes", "historymemes", "lastimages", "okbuddyretard", "comedyheaven"]
        const reddit = subreddits[Math.floor(Math.random() * subreddits.length)]
        fetch(`https://www.reddit.com/r/${reddit}/random.json?limit=1`)
        .then(res => res.json())
        .then(body => {
            message.channel.send(new MessageEmbed()
                .setTitle("Meme")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setImage(body[0].data.children[0].data.url)
                .setDescription(`meme from r/${reddit}`)
            )
        })
    }
} as Command
