import Ellipse from '@/assets/icons/ellipse-104.svg';

interface AvatarProps {
    url: string;
    name: string;
}

export default function Avatar({ url, name }: AvatarProps) {
    return (
        <div className="justify-start items-center gap-2 inline-flex">
            <div className="w-9 h-9 rounded-full border overflow-hidden border-neutral-200">
                {url ? <img src={url} alt={name} /> : <img src={Ellipse} alt="none"></img>}
            </div>
            <div className="text-neutral-800 text-sm font-bold leading-[21px]">{name ? name : '???'}</div>
        </div>
    );
}
