const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

function makeFileUrl(fileName: string) {
    return `${REACT_APP_BASE_IMAGE_URL}/${fileName}`;
}

export { makeFileUrl };
