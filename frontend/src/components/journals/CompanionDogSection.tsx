import Avatar from '@/components/commons/Avatar';
import ExcrementDisplay from '@/components/journals/ExcrementDisplay';
import Heading from '@/components/journals/Heading';
import { DogAvatar } from '@/models/dog';

export default function CompanionDogSection({ dogs }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>함께한 댕댕이</Heading>
            <div className="flex flex-col">
                {dogs.map((dog) => (
                    <div key={dog.id} className="flex h-[52px] justify-between">
                        <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                        <ExcrementDisplay fecesCount={dog.fecesCount} urineCount={dog.urineCount} />
                    </div>
                ))}
            </div>
        </div>
    );
}

interface Props {
    dogs: Array<CompanionDog>;
}

export interface CompanionDog extends DogAvatar {
    fecesCount: number;
    urineCount: number;
}
