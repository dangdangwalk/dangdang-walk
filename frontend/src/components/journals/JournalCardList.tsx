import JournalCard from '@/components/journals/JournalCard';
import { DogAvatar } from '@/models/dog';
import { Journal } from '@/models/journal';

export default function JournalCardList({ journals, dog }: { journals: Journal[]; dog: DogAvatar | undefined }) {
    return (
        <div className="flex flex-col items-center justify-start gap-3 px-5 py-[14px]">
            {journals.map((journal) => {
                return <JournalCard key={journal.journalId} journal={journal} dog={dog} />;
            })}
        </div>
    );
}
