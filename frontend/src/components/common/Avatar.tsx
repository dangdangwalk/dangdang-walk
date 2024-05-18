import NoProfileImage from '@/components/common/NoProfileImage';

interface AvatarProps {
    url?: string;
    name?: string;
}

export default function Avatar({ url, name }: AvatarProps) {
    return (
        <div className="justify-start items-center gap-2 inline-flex">
            <div className="w-9 h-9 flex justify-center items-center rounded-full border overflow-hidden border-neutral-200">
                {url ? <img src={url} alt={name} /> : <NoProfileImage />}
            </div>
            <div className="text-neutral-800 text-sm font-bold leading-[21px]">{name ? name : '???'}</div>
        </div>
    );
}
