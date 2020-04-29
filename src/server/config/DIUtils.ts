export namespace DI {
    export interface Dependency<T> {
        type: T | null;
        name: string | null;
    }

    export function Dependency<T>(name: string | null = null): Dependency<T> { return { type: null, name: name }; }

    // eslint-disable-next-line
    const configMap = new Map<any, () => any>();

    // eslint-disable-next-line
    const instanceMap = new Map<any, any>();

    export function register<T>(key: Dependency<T>, factory: () => T | Promise<T>): void {
        configMap.set(key, factory);
    }

    export async function resolve<T>(key: Dependency<T>): Promise<T> {
        let instance = instanceMap.get(key);
        if (!instance) {
            const factory = configMap.get(key);
            if (!factory) {
                throw new Error(`Failed to resolve dependency: ${ key.name }`);
            }
            instance = await factory();
            instanceMap.set(key, instance);
        }

        return instance;
    }
}
