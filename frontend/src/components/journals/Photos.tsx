import AddPhotoButton, { Props as AddPhotoButtonProps } from '@/components/journals/AddPhotoButton';
import DogImages, { Props as DogImagesProps } from '@/components/journals/DogImages';
import Heading from '@/components/journals/Heading';

export default function Photos({ imageFileNames, isLoading, onChange }: Props3) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>사진</Heading>
            <DogImages imageFileNames={imageFileNames}>
                <AddPhotoButton isLoading={isLoading} onChange={onChange} />
            </DogImages>
        </div>
    );
}

interface Props3 extends AddPhotoButtonProps, Pick<DogImagesProps, 'imageFileNames'> {}
