import DefaultProfileImage from '@/components/common/DefaultProfileImage';
import WalkInfo from '@/components/walk/WalkInfo';
import { Dog } from '@/models/dog';
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
interface PageState extends Journal {
    dogName: string;
}

export default function JournalCard({ journal, dog }: { journal: Journal; dog: Dog | undefined }) {
    const navigate = useNavigate();
    const goToDetail = (id: number) => {
        if (!dog) return;
        const state: PageState = { ...journal, dogName: dog.name };
        navigate(`/journals/${id}`, { state });
    };
    if (!dog) return <></>;
    return (
        <button
            className="relative flex h-[140px] w-full flex-col items-center rounded-lg bg-white pb-2 pt-4 shadow"
            onClick={() => {
                goToDetail(journal.journalId);
            }}
        >
            <div className="flex w-full justify-start gap-3 px-4">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                    {dog.profilePhotoUrl ? (
                        <img className="h-12 w-12" src={dog.profilePhotoUrl} alt={dog.name} />
                    ) : (
                        <DefaultProfileImage />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-sm font-bold leading-[21px] text-neutral-800">
                        {getTitle(dog.name, journal.journalCnt)}
                    </div>
                    <div className="font-normalleading-[18px] text-xs text-neutral-400">
                        {getStartToEnd(journal.startedAt, journal.duration)}
                    </div>
                </div>
            </div>
            <WalkInfo
                distance={journal.distance}
                duration={journal.duration}
                calories={journal.calories}
                isDivider={false}
                className="mt-2 gap-0 px-[10px] pb-2"
            />
        </button>
    );
}
