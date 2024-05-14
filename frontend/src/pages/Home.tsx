import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import Notification from '@/assets/icons/notification.svg';
import Topbar from '@/components/common/Topbar';
import BottomSheet from '@/components/common/BottomSheet';
import { Dog } from '@/models/dog.model';
import AvailableDogCheckList from '@/components/home/AvailableDogCheckList';
import useDogStatistic from '@/hooks/useDogStatistic';
import { useNavigate } from 'react-router-dom';
import useWalkAvailabeDog from '@/hooks/useWalkAvailabeDog';
import Spinner from '@/components/common/Spinner';
import { useAuth } from '@/hooks/useAuth';
import RegisterCard from '@/components/home/RegisterCard';

export interface AvailableDog extends Dog {
    isChecked: boolean;
}
function Home() {
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const [availableDogs, setAvailableDogs] = useState<AvailableDog[] | undefined>([]);
    const { availableDogsData, isAvailableDogsLoading, fetchWalkAvailableDogs } = useWalkAvailabeDog();
    const { refreshTokenQuery, isLoggedIn } = useAuth();
    const { dogs, isDogsPending } = useDogStatistic(isLoggedIn, {
        enabled: refreshTokenQuery.isSuccess,
    });
    const navigate = useNavigate();
    const handleBottomSheet = () => {
        if (!isDogBottomsheetOpen) {
            fetchWalkAvailableDogs();
        }
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
    };
    const handleToggle = (id: number) => {
        setAvailableDogs(
            availableDogs?.map((d: AvailableDog) => (d.id === id ? { ...d, isChecked: !d.isChecked } : d))
        );
    };
    const handleConfirm = () => {
        setIsDogBottomsheetOpen(false);
        navigate('/walk', {
            state: availableDogs?.length === 1 ? availableDogs : availableDogs?.filter((d) => d.isChecked),
        });
    };

    useEffect(() => {
        if (!availableDogsData) return;
        setAvailableDogs(
            availableDogsData?.map((d) => {
                return { ...d, isChecked: false };
            })
        );
    }, [availableDogsData]);

    return (
        <>
            <Topbar className="bg-neutral-50 ">
                <Topbar.Front></Topbar.Front>
                <Topbar.Center></Topbar.Center>
                <Topbar.Back>
                    <img src={Notification} alt="Notification" />
                </Topbar.Back>
            </Topbar>
            <main
                className="flex flex-col px-5 bg-neutral-50 mb-[60px] min-h-dvh"
                style={{ minHeight: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT}  )` }}
            >
                <WeatherInfo />
                {/* TODO : Pending 로직 제외하는 방법ㄴ */}
                {isDogsPending ? (
                    <Spinner />
                ) : dogs && dogs?.length > 0 ? (
                    <>
                        <DogCardList dogs={dogs} />
                        <Button
                            color={'primary'}
                            rounded={'medium'}
                            className={`w-[120px] h-12 fixed  text-white text-base font-bold leading-normal`}
                            style={{ bottom: `calc(${NAV_HEIGHT} + 16px)`, left: '50%', translate: '-50%' }}
                            disabled={dogs?.length === 0}
                            onClick={handleBottomSheet}
                        >
                            산책하기
                        </Button>
                    </>
                ) : (
                    <RegisterCard />
                )}
            </main>

            <BottomSheet isOpen={isDogBottomsheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {isAvailableDogsLoading ? (
                        <Spinner />
                    ) : (
                        availableDogs?.map((dog) => (
                            <AvailableDogCheckList dog={dog} key={dog.id} onToggle={handleToggle} />
                        ))
                    )}
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton
                    onConfirm={handleConfirm}
                    disabled={availableDogs?.find((d) => d.isChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </>
    );
}

export default Home;
