import { Image } from '@/pages/Journals/CreateForm';
import { ReactNode } from 'react';

export default function DogImages({ images, children }: Props) {
    return (
        <div className="flex flex-row gap-1 overflow-x-auto">
            {images.map((image) => (
                <span key={image.url} className="inline-block min-w-[104px] h-[104px] bg-slate-300">
                    강아지 이미지
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
