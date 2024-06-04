import { DogStatistic } from '@/models/dog';
import { walkPercentFormat } from '@/utils/format';
import Ic from '@/assets/icons/ic-arrow-right.svg';
import Avatar from '@/components/commons/Avatar';
import DayIcon from '@/components/home/DayIcon';
import Walk from '@/assets/icons/ic-walk.svg';
import Progressbar from '@/components/home/Progressbar';

interface DogCardProps {
    dog: DogStatistic;
    pageMove?: (id: number) => void;
}

const WEEKDAY = ['월', '화', '수', '목', '금', '토', '일'];
//TODO navigator 위치
export default function DogCard({ dog, pageMove }: DogCardProps) {
    return (
        <div
            className="relative flex-col rounded-lg bg-white shadow"
            onClick={() => {
                if (!pageMove) return;
                pageMove(dog.id);
            }}
        >
            <div className="flex justify-between pl-[15px] pr-5 pt-[5px]">
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <img src={Ic} alt="ic" />
            </div>
            <div className="flex items-center justify-start gap-2 pl-[15px]">
                {dog.weeklyWalks.map((walk, index) => {
                    return walk === 0 ? (
                        <DayIcon key={WEEKDAY[index]} day={WEEKDAY[index]} />
                    ) : (
                        <img src={Walk} alt="walk" key={index} />
                    );
                })}
            </div>
            <div className="flex flex-col justify-start gap-3 p-2.5 pr-[15px]">
                <div className="pl-[5px] text-xs font-bold leading-[18px] text-neutral-800">
                    {dog.todayWalkAmount === 0
                        ? '산책하러 나가요!'
                        : dog.todayWalkAmount >= dog.recommendedWalkAmount
                          ? '오늘은 만족스러워요😁'
                          : '산책이 모자라요😢'}
                </div>
                <div className="flex items-center justify-between gap-2">
                    <Progressbar percentage={(dog.todayWalkAmount / dog.recommendedWalkAmount) * 100} />
                    <span>
                        <span className="text-sm font-bold leading-[21px] text-amber-500">
                            {walkPercentFormat(Number(dog.todayWalkAmount) / Number(dog.recommendedWalkAmount))}
                        </span>
                        <span className="text-sm font-bold leading-[18px] text-neutral-400">/100</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
