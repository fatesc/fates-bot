import client from "./Client";
import server from "./Web/index";

server.listen(80, () => console.log("server listening on port 80"));
client.login(process.env.TOKEN)
.then(() => "client logged in");