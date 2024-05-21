import DogCard from '@/components/home/DogCard';
import { DogStatistic } from '@/models/dog.model';

export default function DogCardList({
    dogs,
    pageMove,
}: {
    dogs: DogStatistic[] | undefined;
    pageMove: (id: number) => void;
}) {
    return (
        <div className="flex py-6 gap-4 justify-start flex-col">
            {dogs?.map((dog) => {
                return <DogCard key={dog.id} dog={dog} pageMove={pageMove} />;
            })}
        </div>
    );
}
