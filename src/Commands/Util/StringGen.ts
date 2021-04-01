const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

export function generateString(len: number) {
    let str = ''
    const charlen = chars.length
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * charlen));
    }
    return str
}
