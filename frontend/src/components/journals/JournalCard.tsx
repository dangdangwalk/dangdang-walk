import DefaultProfileImage from '@/components/common/DefaultProfileImage';
import WalkInfo from '@/components/walk/WalkInfo';
import { Dog } from '@/models/dog.model';
import { Journal } from '@/models/journals';
import { formDate, formTime } from '@/utils/date';
import { useNavigate } from 'react-router-dom';

const getTitle = (name: string, count: number): string => {
    return `${name}와의 ${count}번째 산책`;
};

const getStartToEnd = (start: string, seconds: number) => {
    const startTime = new Date(start);
    const endTime = new Date(start);
    endTime.setSeconds(endTime.getSeconds() + seconds);
    return `${formDate(startTime)} ${formTime(startTime)}-${formTime(endTime)}`;
};

export default function JournalCard({ journal, dog }: { journal: Journal; dog: Dog }) {
    const navigate = useNavigate();
    const goToDetail = (id: number) => {
        navigate(`/journals/detail/${id}`);
    };
    return (
        <button
            className="h-[140px] w-full flex flex-col items-center pt-4 pb-2 relative bg-white rounded-lg shadow"
            onClick={() => {
                goToDetail(dog.id);
            }}
        >
            <div className="w-full flex justify-start gap-3 px-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                    {dog.profilePhotoUrl ? (
                        <img className="w-12 h-12" src={dog.profilePhotoUrl} alt={dog.name} />
                    ) : (
                        <DefaultProfileImage />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-neutral-800 text-sm font-bold  leading-[21px]">
                        {getTitle(dog.name, journal.journalCnt)}
                    </div>
                    <div className="text-neutral-400 text-xs font-normalleading-[18px]">
                        {getStartToEnd(journal.startedAt, journal.duration)}
                    </div>
                </div>
            </div>
            <WalkInfo
                distance={journal.distance / 1000}
                duration={journal.duration}
                calories={journal.calories}
                isDivider={false}
                className="px-[10px] gap-0 mt-2 pb-2"
            />
        </button>
    );
}
