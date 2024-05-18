import { Button } from '@/components/common/Button';
import DogCard from '@/components/home/DogCard';
import { DogStatistic } from '@/models/dog.model';
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
        navigator('/join', { state: 'DogBasicInfo' });
    };
    return (
        <div className="relative">
            <DogCard dog={defaultDpg} />
            <div className="w-full h-full flex flex-col justify-center items-center top-0 left-0 absolute z-20 backdrop-blur-sm rounded-lg">
                <div className="text-black text-lg font-bold leading-[27px] mb-1">산책기록</div>
                <div className="text-stone-500 text-xs font-semibold  leading-[18px] mb-3">
                    반려견을 등록하면 산책 기록을 볼 수 있어요!
                </div>

                <Button
                    className="w-[86px] h-[30px] text-xs font-extrabold"
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
