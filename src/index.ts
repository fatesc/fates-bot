import client from "./Client";
import server from "./Web/index";
import { ConnectionOptions } from "mysql2"
import { createPool } from "mysql2/promise"

const db: ConnectionOptions = {
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
}
export const sql = createPool(db)

sql.getConnection().then((connection) => {
    console.log(`connected to mysql//mariadb`);
    connection.release()
})

server.listen(8080, () => console.log("server listening on port 80"));
client.login(process.env.TOKEN)
.then(() => "client logged in");