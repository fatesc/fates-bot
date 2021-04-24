import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import convertIdToUnix from "../Commands/Util/IdToUnix";
import { unix } from "moment";

const server = Router();

server.get("/user/:id", (req: Request, res: Response) => {
    const userid = req.params.id
    fetch("https://discord.com/api/v8/users/" + userid, {
        method: "GET",
        headers: {
            "Authorization": "Bot " + process.env.TOKEN
        }
    })
    .then(body => body.json())
    .then(json => {
        if (json.username) {
            json.avatarUrl = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`
            json.unix = convertIdToUnix(json.id);
            json.createdAt = unix(json.unix / 1000).format("YYYY-MM-DD, h:mm:ss A")
            res.json(json);
        } else {
            res.json(json)
        }
    })
})

export default server