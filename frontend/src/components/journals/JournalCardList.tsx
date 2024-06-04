import JournalCard from '@/components/journals/JournalCard';
import { Dog } from '@/models/dog.model';
import { Journal } from '@/models/journals';

export default function JournalCardList({ journals, dog }: { journals: Journal[]; dog: Dog | undefined }) {
    return (
        <div className="flex flex-col items-center justify-start gap-3 px-5 py-[14px]">
            {journals.map((journal) => {
                return <JournalCard key={journal.journalId} journal={journal} dog={dog} />;
            })}
        </div>
    );
}
