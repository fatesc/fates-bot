import express from "express";
import { Request, Response } from "express";
import { getFullConfig, getServerConfig } from "../Commands/Util/getConf";
import tempRoute from "./routes";

const server = express();

server.get("/", (req: Request, res: Response) => {
    getFullConfig()
    .then(conf => res.json(conf))
    .catch(err => res.json({err}))
})

server.get("/guilds/:endpoint", (req: Request, res: Response) => {
    getServerConfig(req.params.endpoint)
    .then(conf => res?.json(conf) ?? res.json({err:"server not found"}))
    .catch(err => res.json({err}))
})

server.use("/api/discord", tempRoute);

export default server

// https://bot.fate0.xyz
