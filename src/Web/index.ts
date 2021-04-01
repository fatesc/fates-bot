import express from "express";
import { Request, Response } from "express";
import { getFullConfig } from "../Commands/Util/getConf";
const server = express();

server.get("*", (req: Request, res: Response) => {
    getFullConfig()
    .then(conf => res.json(conf))
    .catch(err => res.json({err}))
})

// https://bot.fate0.xyz

export default server