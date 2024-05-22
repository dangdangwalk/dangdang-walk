import DefaultProfileImage from '@/components/common/DefaultProfileImage';
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
    console.log(url);
    return (
        <div className={`justify-start items-center gap-2 inline-flex ${className}`} onClick={onClick}>
            <div className={`flex justify-center items-center rounded-full border overflow-hidden border-neutral-200`}>
                <div
                    className="flex justify-center items-center"
                    style={{ width: imgSize(size), height: imgSize(size) }}
                >
                    {convertedUrl ? <img src={convertedUrl} alt={name} /> : <DefaultProfileImage />}
                </div>
            </div>
            {name && <div className="text-neutral-800 text-sm font-bold leading-[21px]">{name ? name : ''}</div>}
        </div>
    );
}

function convertUrl(url?: string | null): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http') || url.startsWith('/static')) return url;
    return `${REACT_APP_BASE_IMAGE_URL}/${url}`;
}
