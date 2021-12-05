export default class Logger {

    public static info(content: string): void {
        console.log("[ELIXIR MUSIC] " + content);
    }

    public static error(content: string): void {
        console.error("[ELIXIR MUSIC] " + content);
    }

    public static clear(): void {
        console.clear();
    }
}