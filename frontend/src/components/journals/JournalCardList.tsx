import Spinner from '@/components/commons/Spinner';
import JournalCard from '@/components/journals/JournalCard';
import { DogAvatar } from '@/models/dog';
import { Journal } from '@/models/journal';

interface JournalCardListProps {
    journals: Journal[] | undefined;
    dog: DogAvatar | undefined;
    isLoading: boolean;
}

export default function JournalCardList({ journals, dog, isLoading }: JournalCardListProps) {
    if (isLoading) return <Spinner />;

    return (
        <div className="flex flex-col items-center justify-start gap-3 px-5 py-[14px]">
            {journals?.map((journal) => {
                return <JournalCard key={journal.journalId} journal={journal} dog={dog} />;
            })}
        </div>
    );
}
