import { httpClient } from '@/api/http';
import { storageKeys } from '@/constants';
import { getStorage } from '@/utils/storage';

export const fetchDogBreeds = async () => {
    const isLoggedIn = getStorage(storageKeys.IS_LOGGED_IN) ? true : false;
    if (isLoggedIn) {
        const { data } = await httpClient.get('/breeds');
        return data;
    }
};
