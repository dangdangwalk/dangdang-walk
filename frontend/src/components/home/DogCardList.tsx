import DogCard from '@/components/home/DogCard';
import { DogStatistic } from '@/models/dog';

export default function DogCardList({
    dogsStatistic,
    pageMove,
}: {
    dogsStatistic: DogStatistic[] | undefined;
    pageMove: (id: number) => void;
}) {
    return (
        <div className="flex flex-col justify-start gap-4 py-6">
            {dogsStatistic?.map((dog) => {
                return <DogCard key={dog.id} dog={dog} pageMove={pageMove} />;
            })}
        </div>
    );
}
