// import { Message } from "discord.js";
// import { MessageEmbed } from "discord.js";
// import { FieldPacket, OkPacket, QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
// import { sql } from "../../index";

import { Message } from "discord.js";

// export async function AsyncQuery<T>(query: string, args?: any[] | object): Promise<T> {
//     return new Promise((resolve, reject) => {

//         let func = (result: [(RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader), FieldPacket[]]) => {
//             return resolve((result && !!result?.length ? result[0] : result) as any)
//         }
        
//         sql.getConnection().then(con=>{
//             con.query({
//                 sql: query,
//                 values: args
//             }).then(func, (rej: QueryError) => reject(`Rejection from mysql ${rej}`))
//             con.release()
//         })

//     })

// }


// export function handleSqlRejection(reject: PromiseRejectedResult, message?: Message, optional?: string) {
//     const rejectionmsg = `${optional ?? ""} ${reject}`
//     if (message) {
//         message.channel.send(new MessageEmbed()
//             .setTitle("Fail")
//             .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
//             .setDescription(rejectionmsg)
//         )
//     } else {
//         console.log(rejectionmsg);
//     }
// }

export const AsyncQuery=<T>(q?:string,a?:any[]):Promise<T> => new Promise(a => {});
export const handleSqlRejection=(r?:PromiseRejectedResult,m?:Message) => {}