import { Cookies } from 'react-cookie';

const cookie = new Cookies();

const getCookie = (name: string) => {
    return cookie.get(name);
};

const removeCookie = (name: string) => {
    return cookie.remove(name);
};

export { getCookie, removeCookie };
