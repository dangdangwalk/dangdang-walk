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
import Spinner from '@/components/commons/Spinner';
import RegisterCard from '@/components/home/RegisterCard';
import { queryStringKeys } from '@/constants';
import { setFlagValueByKey, toggleCheckById } from '@/utils/check';
import useWalkAvailable from '@/hooks/useWalkAvailableDog';

function Home() {
    const [isDogBottomSheetOpen, setIsDogBottomSheetOpen] = useState<boolean>(false);
    const {
        isAvailableDogsLoading,
        fetchWalkAvailableDogs,
        walkAvailableDogs,
        setWalkAvailableDogs: setAvailableDogs,
    } = useWalkAvailable();
    const { dogStatistics, isDogsPending } = useDogsStatistic();
    const [isAvailableDogsCheckedAll, setIsAvailableDogsCheckedAll] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleBottomSheet = () => {
        if (!isDogBottomSheetOpen) {
            fetchWalkAvailableDogs();
            setIsDogBottomSheetOpen(true);
        } else {
            handleCheckAll(false);
            setIsDogBottomSheetOpen(false);
            setIsAvailableDogsCheckedAll(false);
        }
    };

    const handleConfirm = () => {
        setIsDogBottomSheetOpen(false);
        navigate('/walk', {
            state: {
                dogs:
                    walkAvailableDogs?.length === 1 ? walkAvailableDogs : walkAvailableDogs?.filter((d) => d.isChecked),
            },
        });
    };

    const goToJournals = (dogId: number) => {
        navigate(`/journals?${queryStringKeys.DOG_ID}=${dogId}`, {
            state: { dogs: dogStatistics, dog: dogStatistics?.find((d) => d.id === dogId) },
        });
    };

    const handleToggle = (id: number) => {
        setAvailableDogs((prevAvailableDogs) =>
            prevAvailableDogs?.length ? toggleCheckById(prevAvailableDogs, id, 'isChecked') : prevAvailableDogs
        );
    };
    const handleCheckAll = (flag: boolean) => {
        setAvailableDogs((prevAvailableDogs) =>
            prevAvailableDogs?.length ? setFlagValueByKey(prevAvailableDogs, flag, 'isChecked') : prevAvailableDogs
        );
        setIsAvailableDogsCheckedAll(flag);
    };

    return (
        <>
            <Topbar className="bg-neutral-50 px-5">
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
                ) : dogStatistics && dogStatistics?.length > 0 ? (
                    <>
                        <DogCardList dogs={dogStatistics} pageMove={goToJournals} />
                        <Button
                            color={'primary'}
                            rounded={'medium'}
                            className={`fixed h-12 w-[120px] text-base font-bold leading-normal text-white`}
                            style={{ bottom: `calc(${NAV_HEIGHT} + 16px)`, left: '50%', translate: '-50%' }}
                            disabled={dogStatistics?.length === 0}
                            onClick={handleBottomSheet}
                        >
                            산책하기
                        </Button>
                    </>
                ) : (
                    <RegisterCard />
                )}
            </main>

            <BottomSheet isOpen={isDogBottomSheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 산책</BottomSheet.Header>
                <BottomSheet.Body>
                    {isAvailableDogsLoading ? (
                        <Spinner />
                    ) : walkAvailableDogs && walkAvailableDogs?.length > 0 ? (
                        <AvailableDogCheckList
                            dogs={walkAvailableDogs}
                            onToggle={handleToggle}
                            checkAll={handleCheckAll}
                            isCheckedAll={isAvailableDogsCheckedAll}
                        />
                    ) : (
                        <div>산책할 강아지가없습니다</div>
                    )}
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton
                    onConfirm={handleConfirm}
                    disabled={walkAvailableDogs?.find((d) => d.isChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </>
    );
}

export default Home;
