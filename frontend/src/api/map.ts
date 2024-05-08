import { createClient } from '@/api/http';

const { REACT_APP_KAKAO_CLIENT_ID: KAKAO_CLIENT_ID = '', REACT_APP_KAKAO_MAP_URL: KAKAO_MAP_URL = '' } =
    window._ENV ?? process.env;

const mapClient = createClient({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
        Authorization: `KakaoAK ${KAKAO_CLIENT_ID}`,
    },
    baseURL: KAKAO_MAP_URL,
    withCredentials: false,
});

interface KakaoResponseAddress {
    region_type: string;
    code: string;
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    x: string;
    y: string;
}

export const fetchAddress = async (lat: number, lng: number): Promise<KakaoResponseAddress | undefined> => {
    const data = (await mapClient.get(`/geo/coord2regioncode.json?x=${lng}&y=${lat}`)).data;

    return data.documents[0];
};
