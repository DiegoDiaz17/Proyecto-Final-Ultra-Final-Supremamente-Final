// Pequeño wrapper para localStorage con fallback en memoria
type Raw = string | null;

class MemoryStorage {
    private store: Record<string, string> = {};
    getItem(key: string): Raw {
        return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
    }
    setItem(key: string, value: string): void {
        this.store[key] = value;
    }
    removeItem(key: string): void {
        delete this.store[key];
    }
}

const memory = new MemoryStorage();

function available(): boolean {
    try {
        if (typeof window === 'undefined' || !window) return false;
        const ls = window.localStorage;
        const testKey = '__storage_test__';
        ls.setItem(testKey, '1');
        ls.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

const useLocal = available();

export function storageGet(key: string): Raw {
    try {
        if (useLocal) return window.localStorage.getItem(key);
        return memory.getItem(key);
    } catch (e) {
        return memory.getItem(key);
    }
}

export function storageSet(key: string, value: string): void {
    try {
        if (useLocal) window.localStorage.setItem(key, value);
        else memory.setItem(key, value);
    } catch (e) {
        memory.setItem(key, value);
    }
}

export function storageRemove(key: string): void {
    try {
        if (useLocal) window.localStorage.removeItem(key);
        else memory.removeItem(key);
    } catch (e) {
        memory.removeItem(key);
    }
}

export function storageAvailable(): boolean {
    return useLocal;
}

export default {
    get: storageGet,
    set: storageSet,
    remove: storageRemove,
    available: storageAvailable
};
