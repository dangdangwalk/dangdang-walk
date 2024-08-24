import { DataStore, getDataStore } from './data-store';

let dataStoreInstance: DataStore | null = null;

//TODO: erase
export async function getDataInstance(): Promise<DataStore> {
    if (!dataStoreInstance) {
        dataStoreInstance = getDataStore();
        await dataStoreInstance.initialize();
        Object.freeze(dataStoreInstance);
    }
    return dataStoreInstance;
}
