import fetch from "node-fetch";
import { Client, Message } from "discord.js";

const typeMap : Map<string,number> = new Map([["normal",1],["yuri",2],["femboy",3],["furry",4],["futa",5],["yoai",6]])

module.exports = {
    name: "hentai",
    description: "hentai - gives you hentai. first arg is the amount and the second arg is the type, types are 1 for normal, 2 for yuri, 3 for femboy, 4 for furry, 5 for futa, 6 for yoai. (credits to pozm for the api)",
    usage: "hentai [?amount] [?type] [?search query]",
    nsfw: true,
    cooldown: 2,
    guildOnly: true,
    run(client: Client, message: Message, args: string[]){
        let passed = [!Number.isNaN(args[0]) ]
        const amount = !passed[0] ? 1 : args[0]
        let type =  (passed[0] ? args[1] ?? 1 : typeMap.get(args[0])) ?? 1
        let search = "&search=" + (passed[0] ? args.slice(2).join('_') : args.slice(1).join('_')) ?? ""
        if (!message.member.hasPermission("ADMINISTRATOR")){
            if (amount > 3){return message.channel.send(`max is 3!! ${message.member}`);}
        }
        fetch(`https://pozm.pw/api/Dev/ahentai?type=${type}&amount=${amount}` + search, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.POZM_KEY ?? ""
              }
        }).then(res => res.text(), err => {return message.channel.send("Got error from pozm's api " + err.name)})
        .then(body => {
            body.data.files.join("") != "" ? message.channel.send(body.data.files.join(" ") + ` ${message.member}`) :  message.channel.send(`no results found ${message.member}`)
        },err=>{message.channel.send('Got error when parsing json :' + err.name)});
    }
}     
