export default function convertIdToUnix(id: string): number {    
    const bin = (+id).toString(2)
    return parseInt(bin.substring(0, 42 - (64 - bin.length)), 2) + 1420070400000
}   