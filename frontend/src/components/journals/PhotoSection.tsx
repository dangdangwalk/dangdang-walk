import AddImageButton, { Props as AddPhotoButtonProps } from '@/components/journals/AddImageButton';
import Heading from '@/components/journals/Heading';
import RemovableImageList, { Props as DogImagesProps } from '@/components/journals/RemovableImageList';

export default function PhotoSection({ imageFileNames, isLoading, isModifying, onChange, onDeleteImage }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>사진</Heading>
            <RemovableImageList imageFileNames={imageFileNames} isModifying={isModifying} onDeleteImage={onDeleteImage}>
                <AddImageButton isLoading={isLoading} onChange={onChange} />
            </RemovableImageList>
        </div>
    );
}

interface Props extends AddPhotoButtonProps, Pick<DogImagesProps, 'imageFileNames' | 'isModifying' | 'onDeleteImage'> {}
