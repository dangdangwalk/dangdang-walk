import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import { useState } from 'react';
import { Button } from '@/components/commons/Button';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import Notification from '@/assets/icons/ic-notification.svg';
import Topbar from '@/components/commons/Topbar';
import BottomSheet from '@/components/commons/BottomSheet';
import AvailableDogCheckList from '@/components/home/AvailableDogCheckList';
import useDogsStatistic from '@/hooks/useDogsStatistic';
import { useNavigate } from 'react-router-dom';
import useWalkAvailabeDog from '@/hooks/useWalkAvailabeDog';
import Spinner from '@/components/commons/Spinner';
import RegisterCard from '@/components/home/RegisterCard';
import { queryStringKeys } from '@/constants';
import { setFlagValueByKey, toggleCheckById } from '@/utils/check';

function Home() {
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const { isAvailableDogsLoading, fetchWalkAvailableDogs, availableDogs, setAvailableDogs } = useWalkAvailabeDog();
    const { dogs, isDogsPending } = useDogsStatistic();
    const navigate = useNavigate();
    const handleBottomSheet = () => {
        if (!isDogBottomsheetOpen) {
            fetchWalkAvailableDogs();
        }
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
    };

    const handleConfirm = () => {
        setIsDogBottomsheetOpen(false);
        navigate('/walk', {
            state: { dogs: availableDogs?.length === 1 ? availableDogs : availableDogs?.filter((d) => d.isChecked) },
        });
    };

    const goToJournals = (dogId: number) => {
        navigate(`/journals?${queryStringKeys.DOGID}=${dogId}`, {
            state: { dogs, dog: dogs.find((d) => d.id === dogId) },
        });
    };

    const handleToggle = (id: number) => {
        if (!availableDogs) return;
        const newAvailableDogs = toggleCheckById(availableDogs, id, 'isChecked');
        setAvailableDogs(newAvailableDogs);
    };
    const handleCheckAll = (flag: boolean) => {
        if (!availableDogs) return;
        const newAvailableDogs = setFlagValueByKey(availableDogs, flag, 'isChecked');
        setAvailableDogs(newAvailableDogs);
    };

    return (
        <>
            <Topbar className="bg-neutral-50">
                <Topbar.Front></Topbar.Front>
                <Topbar.Center></Topbar.Center>
                <Topbar.Back>
                    <img src={Notification} alt="Notification" />
                </Topbar.Back>
            </Topbar>
            <main
                className="mb-[60px] flex min-h-dvh flex-col bg-neutral-50 px-5"
                style={{ minHeight: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT}  )` }}
            >
                <WeatherInfo />
                {/* TODO : Pending 로직 제외하는 방법ㄴ */}
                {isDogsPending ? (
                    <Spinner />
                ) : dogs && dogs?.length > 0 ? (
                    <>
                        <DogCardList dogs={dogs} pageMove={goToJournals} />
                        <Button
                            color={'primary'}
                            rounded={'medium'}
                            className={`fixed h-12 w-[120px] text-base font-bold leading-normal text-white`}
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
                <BottomSheet.Header> 강아지 산책</BottomSheet.Header>
                <BottomSheet.Body>
                    {isAvailableDogsLoading ? (
                        <Spinner />
                    ) : availableDogs && availableDogs?.length > 0 ? (
                        <AvailableDogCheckList dogs={availableDogs} onToggle={handleToggle} checkAll={handleCheckAll} />
                    ) : (
                        <div>산책할 강아지가없습니다</div>
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
