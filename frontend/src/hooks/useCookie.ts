const useCookie = () => {
    const cookieEntries = document.cookie.split(';');

    let isLoggedInValue = false;
    let expiresIn = 0;
    cookieEntries.forEach((entry) => {
        const [key, value] = entry.split('=');

        if (key === 'isLoggedIn') {
            isLoggedInValue = value === 'true' ? true : false;
        } else if (key === ' expiresIn') {
            expiresIn = Number(value);
        }
    });

    return { isLoggedIn: isLoggedInValue, newExpiresIn: expiresIn };
};

export default useCookie;
