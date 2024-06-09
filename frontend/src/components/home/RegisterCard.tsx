import { Button } from '@/components/commons/Button';
import DogCard from '@/components/home/DogCard';
import { DogStatistic } from '@/models/dog';
import { useNavigate } from 'react-router-dom';

const defaultDpg: DogStatistic = {
    id: 0,
    name: '덕지',
    profilePhotoUrl: '',
    recommendedWalkAmount: 1800,
    todayWalkAmount: 0,
    weeklyWalks: [0, 0, 0, 0, 0, 0, 0],
};

export default function RegisterCard() {
    const navigator = useNavigate();
    const handleClick = () => {
        navigator('/signup', { state: 'DogBasicInfo' });
    };
    return (
        <div className="relative">
            <DogCard dog={defaultDpg} />
            <div className="absolute left-0 top-0 z-20 flex size-full flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                <div className="mb-1 text-lg font-bold leading-[27px] text-black">산책기록</div>
                <div className="mb-3 text-xs font-semibold leading-[18px] text-stone-500">
                    반려견을 등록하면 산책 기록을 볼 수 있어요!
                </div>

                <Button
                    className="h-[30px] w-[86px] text-xs font-extrabold"
                    color={'primary'}
                    rounded={'small'}
                    onClick={handleClick}
                >
                    등록하기
                </Button>
            </div>
        </div>
    );
}
