const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

function makeFileUrl(fileName: string) {
    return `${REACT_APP_BASE_IMAGE_URL}/${fileName}`;
}

function getFileName(fileUrl: string) {
    return fileUrl.replaceAll(`${REACT_APP_BASE_IMAGE_URL}/`, '');
}

export { getFileName, makeFileUrl };
