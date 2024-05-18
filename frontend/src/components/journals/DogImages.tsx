import { ImageUrl } from '@/pages/Journals/CreateForm';
import { ReactNode } from 'react';

export default function DogImages({ imageUrls, children }: Props) {
    return (
        <div className="flex flex-row gap-1 overflow-x-auto">
            {imageUrls.map((imageUrl) => (
                <span key={imageUrl} className="inline-flex items-center h-[104px]">
                    <img src={imageUrl} alt="강아진 산책 사진" className="inline-block max-h-[104px] bg-slate-300" />
                </span>
            ))}
            {children}
        </div>
    );
}

interface Props {
    imageUrls: Array<ImageUrl>;
    children: ReactNode;
}
