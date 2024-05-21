import { ReactComponent as Delete } from '@/assets/icons/btn-delete.svg';
import { ImageFileName } from '@/pages/Journals/CreateForm';
import { makeFileUrl } from '@/utils/url';
import { ReactNode } from 'react';

export default function RemovableImageList({ imageFileNames, children, onDeleteImage, isModifying = false }: Props) {
    return (
        <div className="flex flex-row gap-1 py-2 overflow-x-auto">
            {imageFileNames.map((imageFileName) => (
                <span key={imageFileName} className="inline-flex items-center h-[104px]">
                    <span className="relative">
                        <img
                            src={makeFileUrl(imageFileName)}
                            alt="강아지 산책 사진"
                            className="inline-block max-h-[104px] max-w-none rounded-lg"
                        />
                        {isModifying && (
                            <button className="absolute right-1 top-1" onClick={() => onDeleteImage(imageFileName)}>
                                <Delete />
                            </button>
                        )}
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
    onDeleteImage: (imageFileName: ImageFileName) => Promise<void>;
    isModifying?: boolean;
}
