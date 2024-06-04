import DefaultProfileImage from '@/components/commons/DefaultProfileImage';
import { isImageFileName } from '@/utils/url';
import { MouseEvent } from 'react';

interface AvatarProps {
    url?: string | null;
    name?: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    className?: string;
}
const imgSize = (size: string) => {
    switch (size) {
        case 'small':
            return '36px';
        case 'medium':
            return '64px';
        case 'large':
            return '132px';
    }
};

const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

export default function Avatar({ url, name, size = 'small', onClick, className }: AvatarProps) {
    const convertedUrl = convertUrl(url);

    return (
        <div className={`inline-flex items-center justify-start gap-2 ${className}`} onClick={onClick}>
            <div className={`flex items-center justify-center overflow-hidden rounded-full border border-neutral-200`}>
                <div
                    className="flex items-center justify-center"
                    style={{ width: imgSize(size), height: imgSize(size) }}
                >
                    {convertedUrl ? <img src={convertedUrl} alt={name} /> : <DefaultProfileImage />}
                </div>
            </div>
            {name && <div className="text-sm font-bold leading-[21px] text-neutral-800">{name ? name : ''}</div>}
        </div>
    );
}

function convertUrl(url: undefined | null | string): undefined | null | string {
    if (typeof url === 'string' && isImageFileName(url)) return `${REACT_APP_BASE_IMAGE_URL}/${url}`;
    return url;
}
