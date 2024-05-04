import { Dog } from '@/models/dog.model';
import { walkPercentFormat } from '@/utils/format';
import Ic from '@assets/icons/ic.svg';
import Walk from '@assets/icons/walk/walk.svg';
interface DogStatistic extends Dog {
    recommendedDailyWalkAmount: number;
    dailyWalkAmount: number;
    weeklyWalks: number[];
}

interface DogCardProps {
    dog: DogStatistic;
}

const WEEKDAY = ['월', '화', '수', '목', '금', '토', '일'];
export default function DogCard({ dog }: DogCardProps) {
    return (
        <div>
            <div>
                <div>
                    <div>{dog.name}</div>
                </div>
                <img src={Ic} alt="Ic" />
            </div>
            <div>
                {dog.weeklyWalks.map((walk, index) => {
                    return walk === 0 ? <div>{WEEKDAY[index]}</div> : <img src={Walk} alt="walk" />;
                })}
            </div>
            <div>
                {dog.dailyWalkAmount >= dog.recommendedDailyWalkAmount ? '오늘은 만족스러워요😁' : '산책이 모자라요😢'}
            </div>
            <div>
                <span>progress bar</span>
                <span>
                    <span>{walkPercentFormat(dog.dailyWalkAmount / dog.recommendedDailyWalkAmount)}</span>
                    <span>/100</span>
                </span>
            </div>
        </div>
    );
}
