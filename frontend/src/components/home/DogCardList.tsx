import DogCard from '@/components/home/DogCard';
import { DogStatistic } from '@/models/dog.model';

export default function DogCardList({ dogs }: { dogs: DogStatistic[] | undefined }) {
    return (
        <div className="flex py-6 gap-4 justify-start flex-col">
            {dogs?.map((dog) => {
                return <DogCard key={dog.id} dog={dog} />;
            })}
        </div>
    );
}
