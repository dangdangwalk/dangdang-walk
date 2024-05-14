interface AvatarProps {
    url?: string;
    name?: string;
}

export default function Avatar({ url, name }: AvatarProps) {
    return (
        <div className="justify-start items-center gap-2 inline-flex">
            <div className="w-9 h-9 flex justify-center items-center rounded-full border overflow-hidden border-neutral-200">
                {url ? (
                    <img src={url} alt={name} />
                ) : (
                    <div className="w-full h-full flex justify-center items-center bg-neutral-200">?</div>
                )}
            </div>
            <div className="text-neutral-800 text-sm font-bold leading-[21px]">{name ? name : '???'}</div>
        </div>
    );
}
