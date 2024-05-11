import { Cookies } from 'react-cookie';

const cookie = new Cookies();

const getCookie = (key: string) => {
    return cookie.get(key);
};

export { getCookie };
