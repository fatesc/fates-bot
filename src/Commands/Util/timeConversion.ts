export function timeConversion(millisec: number): string {
    const seconds = Number((millisec / 1000).toFixed(1));
    const minutes = Number((millisec / (1000 * 60)).toFixed(1));
    const hours = Number((millisec / (1000 * 60 * 60)).toFixed(1));
    const days = Number((millisec / (1000 * 60 * 60 * 24)).toFixed(1));
    return seconds < 60 ? seconds + " Sec" : minutes < 60 ? minutes + " Mins" : hours < 24 ? hours + " Hrs" : days + " Days"
}