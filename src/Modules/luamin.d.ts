interface Options {
    SolveMath: boolean
    RenameVariables: boolean
    RenameGlobals: boolean
}
export function Beautify(script: string, options: Options): string;
export function Minify(script: string, options: Options): string;
export function Uglify(script: string, options: Options): string;