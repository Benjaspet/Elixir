export interface Command {
    name: string,
    once: boolean,
    enabled: boolean,
    description: string,
    aliases?: string[],
    slashData: object
}