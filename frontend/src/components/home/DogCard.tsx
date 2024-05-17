import { DogStatistic } from '@/models/dog.model';
import { walkPercentFormat } from '@/utils/format';
import Ic from '@/assets/icons/ic-arrow.svg';
import Avatar from '@/components/common/Avatar';
import DayIcon from '@/components/home/DayIcon';
import Walk from '@/assets/icons/walk/walk.svg';
import Progressbar from '@/components/home/Progressbar';
import { useNavigate } from 'react-router-dom';

interface DogCardProps {
    dog: DogStatistic;
}

const WEEKDAY = ['월', '화', '수', '목', '금', '토', '일'];
//TODO navigator 위치
export default function DogCard({ dog }: DogCardProps) {
    const navigate = useNavigate();
    const onclick = () => {
        navigate(`/journal/${dog.id}`);
    };
    return (
        <div className="flex-col relative bg-white rounded-lg shadow" onClick={onclick}>
            <div className="flex justify-between pl-[15px] pr-5 pt-[5px]">
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <img src={Ic} alt="ic" />
            </div>
            <div className="flex justify-start items-center gap-2 pl-[15px]">
                {dog.weeklyWalks.map((walk, index) => {
                    return walk === 0 ? (
                        <DayIcon key={WEEKDAY[index]} day={WEEKDAY[index]} />
                    ) : (
                        <img src={Walk} alt="walk" key={index} />
                    );
                })}
            </div>
            <div className="p-2.5 pr-[15px] flex flex-col justify-start gap-3">
                <div className="text-neutral-800 pl-[5px] text-xs font-bold leading-[18px]">
                    {dog.todayWalkAmount === 0
                        ? '산책하러 나가요!'
                        : dog.todayWalkAmount >= dog.recommendedWalkAmount
                          ? '오늘은 만족스러워요😁'
                          : '산책이 모자라요😢'}
                </div>
                <div className="flex gap-2 justify-between items-center">
                    <Progressbar percentage={(dog.todayWalkAmount / dog.recommendedWalkAmount) * 100} />
                    <span>
                        <span className="text-amber-500 text-sm font-bold leading-[21px]">
                            {walkPercentFormat(Number(dog.todayWalkAmount) / Number(dog.recommendedWalkAmount))}
                        </span>
                        <span className="text-neutral-400 text-sm font-bold leading-[18px]">/100</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
