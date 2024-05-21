import AddPhotoButton, { Props as AddPhotoButtonProps } from '@/components/journals/AddPhotoButton';
import DogImages from '@/components/journals/DogImages';
import Heading from '@/components/journals/Heading';

export default function Photos({ imageUrls, isLoading, onChange }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>사진</Heading>
            <DogImages imageUrls={imageUrls}>
                <AddPhotoButton isLoading={isLoading} onChange={onChange} />
            </DogImages>
        </div>
    );
}

interface Props extends AddPhotoButtonProps {
    imageUrls: Array<string>;
}
