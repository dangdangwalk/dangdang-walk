import NoProfileImage from '@/components/common/NoProfileImage';
import WalkInfo from '@/components/walk/WalkInfo';
import { Dog } from '@/models/dog.model';
import { Journal } from '@/models/journals';

export default function JournalCard({ journal, dog }: { journal: Journal; dog: Dog }) {
    return (
        <div className="h-[140px] w-full flex flex-col items-center pt-4 pb-2 relative bg-white rounded-lg shadow">
            <div className="w-full flex justify-start gap-3 px-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                    {dog.profilePhotoUrl ? (
                        <img className="w-12 h-12" src={dog.profilePhotoUrl} alt={dog.name} />
                    ) : (
                        <NoProfileImage />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-neutral-800 text-sm font-bold  leading-[21px]">{journal.title}</div>
                    <div className="text-neutral-400 text-xs font-normalleading-[18px]">2024-05-02 17:30-19:30</div>
                </div>
            </div>
            <WalkInfo
                distance={journal.distance}
                duration={journal.duration}
                calories={journal.calories}
                isDivider={false}
                className="px-[10px] gap-0 mt-2 pb-2"
            />
        </div>
    );
}
