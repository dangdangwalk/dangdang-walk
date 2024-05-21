import { ReactComponent as Delete } from '@/assets/icons/btn-delete.svg';
import { ImageFileName } from '@/pages/Journals/CreateForm';
import { makeFileUrl } from '@/utils/url';
import { ReactNode } from 'react';

export default function DogImages({ imageFileNames, children }: Props) {
    return (
        <div className="flex flex-row gap-1 py-2 overflow-x-auto">
            {imageFileNames.map((imageUrl) => (
                <span key={imageUrl} className="inline-flex items-center h-[104px]">
                    <span className="relative">
                        <img
                            src={makeFileUrl(imageUrl)}
                            alt="강아진 산책 사진"
                            className="inline-block max-h-[104px] max-w-none rounded-lg"
                        />
                        <button className="absolute right-1 top-1">
                            <Delete />
                        </button>
                    </span>
                </span>
            ))}
            {children}
        </div>
    );
}

export interface Props {
    imageFileNames: Array<ImageFileName>;
    children: ReactNode;
}
