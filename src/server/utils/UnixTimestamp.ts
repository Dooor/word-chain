export namespace UnixTimestamp {
    export function now(): number {
        return Math.floor(Date.now() / 1000);
    }
}
