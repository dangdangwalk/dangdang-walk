import AddPhotoButton, { Props as AddPhotoButtonProps } from '@/components/journals/AddPhotoButton';
import DogImages, { Props as DogImagesProps } from '@/components/journals/DogImages';
import Heading from '@/components/journals/Heading';

export default function Photos({ imageFileNames, isLoading, isModifying, onChange }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>사진</Heading>
            <DogImages imageFileNames={imageFileNames} isModifying={isModifying}>
                <AddPhotoButton isLoading={isLoading} onChange={onChange} />
            </DogImages>
        </div>
    );
}

interface Props extends AddPhotoButtonProps, Pick<DogImagesProps, 'imageFileNames' | 'isModifying'> {}
