import DefaultProfileImage from '@/components/commons/DefaultProfileImage';
import WalkInfo from '@/components/walk/WalkInfo';
import { Dog } from '@/models/dog';
import { Journal } from '@/models/journal';
import { getStartTimeToEndTime } from '@/utils/time';
import { useNavigate } from 'react-router-dom';

const getJournalTitle = (name: string, count: number): string => {
    return `${name}와의 ${count}번째 산책`;
};

const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

export interface JournalDetailState extends Journal {
    dogName: string;
}

export default function JournalCard({ journal, dog }: { journal: Journal; dog: Dog | undefined }) {
    const navigate = useNavigate();
    const goToDetail = (id: number) => {
        if (!dog) return;
        const state: JournalDetailState = { ...journal, dogName: dog.name };
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
                <div className="size-12 overflow-hidden rounded-lg">
                    {dog.profilePhotoUrl ? (
                        <img
                            className="size-12"
                            src={`${REACT_APP_BASE_IMAGE_URL}/${dog.profilePhotoUrl}`}
                            alt={dog.name}
                        />
                    ) : (
                        <DefaultProfileImage />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-sm font-bold leading-[21px] text-neutral-800">
                        {getJournalTitle(dog.name, journal.journalCnt)}
                    </div>
                    <div className="font-normalleading-[18px] text-xs text-neutral-400">
                        {getStartTimeToEndTime(journal.startedAt, journal.duration)}
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
