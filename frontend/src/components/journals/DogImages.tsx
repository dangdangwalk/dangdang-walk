import { Image } from '@/pages/Journals/CreateForm';
import { ReactNode } from 'react';

export default function DogImages({ images, children }: Props) {
    return (
        <div className="flex flex-row gap-1 overflow-x-auto">
            {images.map((image) => (
                <span key={image.url} className="inline-flex items-center h-[104px]">
                    <img src={image.url} alt={image.name} className="inline-block max-h-[104px] bg-slate-300" />
                </span>
            ))}
            {children}
        </div>
    );
}

interface Props {
    images: Array<Image>;
    children: ReactNode;
}
