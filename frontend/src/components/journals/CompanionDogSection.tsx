import Avatar from '@/components/common/Avatar';
import ExcrementDisplay from '@/components/journals/ExcrementDisplay';
import Heading from '@/components/journals/Heading';
import { WalkingDog } from '@/models/dog.model';

export default function CompanionDogSection({ dogs }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>함께한 댕댕이</Heading>
            <div className="flex flex-col">
                {dogs.map((dog) => (
                    <div key={dog.id} className="flex h-[52px] justify-between">
                        <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                        <ExcrementDisplay
                            fecesCount={dog.fecesLocations.length}
                            urineCount={dog.urineLocations.length}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

interface Props {
    dogs: Array<WalkingDog>;
}
