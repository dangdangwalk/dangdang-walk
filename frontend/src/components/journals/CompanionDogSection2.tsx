import Avatar from '@/components/common/Avatar';
import ExcrementDisplay from '@/components/journals/ExcrementDisplay';
import Heading from '@/components/journals/Heading';

export default function CompanionDogSection({ dogs }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>함께한 댕댕이</Heading>
            <div className="flex flex-col">
                {dogs.map((dog) => (
                    <div key={dog.id} className="flex justify-between h-[52px]">
                        <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                        <ExcrementDisplay fecesCount={dog.fecesCount} urineCount={dog.urineCount} />
                    </div>
                ))}
            </div>
        </div>
    );
}

interface Props {
    dogs: Array<Dog>;
}

export interface Dog {
    id: number;
    name: string;
    profilePhotoUrl: string;
    fecesCount: number;
    urineCount: number;
}
