import { Command } from "../../Command";
import { Message } from "discord.js";
import * as fetch from "node-fetch";
import { helpCommand } from "../Util/HelpCommand";

const numbers = {
    "C#" : 1,
    "VB.NET" : 2,
    "F#" : 3,
    "Java" : 4,
    "Python" : 5,
    "C (gcc)" : 6,
    "C++ (gcc)" : 7,
    "Php" : 8,
    "Pascal" : 9,
    "Objective-C" : 10,
    "Haskell" : 11,
    "Ruby" : 12,
    "Perl" : 13,
    "Lua" : 14,
    "Nasm" : 15,
    "Sql Server" : 16,
    "Javascript" : 17,
    "Lisp" : 18,
    "Prolog" : 19,
    "Go" : 20,
    "Scala" : 21,
    "Scheme" : 22,
    "Node.js" : 23,
    "Python 3" : 24,
    "Octave" : 25,
    "C (clang)" : 26,
    "C++ (clang)" : 27,    
    "C++ (vc++)" : 28,
    "C (vc)" : 29,
    "D" : 30,
    "R" : 31,
    "Tcl" : 32,
    "MySQL" : 33,
    "PostgreSQL" : 34,
    "Oracle" : 35,
    "Swift" : 37,
    "Bash" : 38,
    "Ada" : 39,
    "Erlang" : 40,
    "Elixir" : 41,
    "Ocaml" : 42,
    "Kotlin" : 43,
    "Brainf***" : 44,
    "Fortran" : 45,
    "Rust" : 46,
    "Clojure" : 47,
}

module.exports = {
    name: "rex",
    description: "allows you to run code",
    aliases: ["code"],
    cooldown: 2,
    usage: "rex [code]",
    guildOnly: true,
    run(message: Message, args: string[]) {
        if (!args[0]) return helpCommand(message, this.name, `${message.member}, Invalid Command Usage\n`);
        const lang: string = args[0]
        args.splice(0, 1);
        const code: string = args.join(" ").replace(/^`\S+|`+$/gm, "");

        fetch("https://rextester.com/rundotnet/api", {
            method: "POST",
            data: {
                "LanguageChoice": numbers[lang]?.toString() ?? 1,
                "Program": code
            }
        })
        .then(res => res.json())
        .then(body => {
            message.channel.send(body, {
                disableMentions: "all"
            });
        });
    }
} as Command