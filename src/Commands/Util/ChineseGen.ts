function getrnd(min : number, max : number) {
    return Math.round(Math.random() * (max - min) ) + min;
}

let chinesechars = ""
for (let i=19968; i<40908;i++) {
    chinesechars += String.fromCharCode(i)
}
const RandStrc = (len :number,charset:string) => new Array(Math.round(len)).fill("").map(v=>charset[getrnd(0,charset.length-1)]).join("")

export { RandStrc, chinesechars }