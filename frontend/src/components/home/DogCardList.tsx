import DogCard from '@/components/home/DogCard';
import { DogStatistic } from '@/models/dog';

export default function DogCardList({
    dogs,
    pageMove,
}: {
    dogs: DogStatistic[] | undefined;
    pageMove: (id: number) => void;
}) {
    return (
        <div className="flex flex-col justify-start gap-4 py-6">
            {dogs?.map((dog) => {
                return <DogCard key={dog.id} dog={dog} pageMove={pageMove} />;
            })}
        </div>
    );
}
