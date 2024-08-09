import WeatherInfo from '@/components/home/WeatherInfo';
import { useState } from 'react';
import { Button } from '@/components/commons/Button';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants';
import Notification from '@/assets/icons/ic-notification.svg';
import TopBar from '@/components/commons/Topbar';
import BottomSheet from '@/components/commons/BottomSheet';
import AvailableDogCheckList from '@/components/home/AvailableDogCheckList';
import useDogsStatistic from '@/hooks/useDogsStatistic';
import { useNavigate } from 'react-router-dom';
import { setFlagValueByKey, toggleCheckById } from '@/utils/check';
import useWalkAvailable from '@/hooks/useWalkAvailableDog';
import useGeolocation from '@/hooks/useGeolocation';
import useToast from '@/hooks/useToast';
import { isArrayNotEmpty } from '@/utils/validate';
import DogStatisticsView from '@/components/home/DogStatisticsView';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store';

function Home() {
    const [isDogBottomSheetOpen, setIsDogBottomSheetOpen] = useState<boolean>(false);
    const { position, isLocationDisabled } = useGeolocation();
    const { isAvailableDogsLoading, fetchWalkAvailableDogs, walkAvailableDogs, setWalkAvailableDogs } =
        useWalkAvailable();
    const { dogsStatistic, isDogsPending } = useDogsStatistic();
    const navigate = useNavigate();
    const { show: showToast } = useToast();
    const walkStartedAt = useStore((state) => state.startedAt);
    const resetWalkData = useStore((state) => state.resetWalkData);

    const handleBottomSheetOpen = () => {
        if (isDogsWalking(walkStartedAt)) {
            navigate('/walk');
            return;
        }
        fetchWalkAvailableDogs();
        setIsDogBottomSheetOpen(true);
        resetWalkData();
    };

    const handleBottomSheetClose = () => {
        handleCheckAll(false);
        setIsDogBottomSheetOpen(false);
    };

    const handlePageMove = (url: string, state: any) => {
        navigate(url, { state });
    };

    const isDogsWalking = (startedAt: string): boolean => {
        if (startedAt === '') return false;
        const diff = new Date().getTime() - new Date(startedAt).getTime();
        const hour = diff / 1000 / 60 / 60;
        return hour <= 3;
    };

    const handleConfirm = () => {
        setIsDogBottomSheetOpen(false);
        if (isLocationDisabled) {
            showToast('위치정보를 동의 해주세요 :) !!!');
            handleCheckAll(false);
            return;
        }
        const dogs =
            walkAvailableDogs?.length === 1 ? walkAvailableDogs : walkAvailableDogs?.filter((d) => d.isChecked);
        navigate('/walk', { state: { dogs } });
    };

    const handleToggle = (id: number) => {
        setWalkAvailableDogs((prevAvailableDogs) =>
            prevAvailableDogs?.length ? toggleCheckById(prevAvailableDogs, id, 'isChecked') : prevAvailableDogs
        );
    };
    const handleCheckAll = (flag: boolean) => {
        setWalkAvailableDogs((prevAvailableDogs) =>
            prevAvailableDogs?.length ? setFlagValueByKey(prevAvailableDogs, flag, 'isChecked') : prevAvailableDogs
        );
    };

    return (
        <>
            <HomeHeader />
            <main
                className="mb-[60px] flex min-h-dvh flex-col bg-neutral-50 px-5"
                style={{ minHeight: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT}  )` }}
            >
                <WeatherInfo position={position} />
                <DogStatisticsView dogsStatistic={dogsStatistic} isPending={isDogsPending} pageMove={handlePageMove} />
                {isArrayNotEmpty(dogsStatistic) && (
                    <Button
                        color="primary"
                        rounded="medium"
                        className={`fixed h-12 w-[120px] text-base font-bold leading-normal text-white`}
                        style={{ bottom: `calc(${NAV_HEIGHT} + 16px)`, left: '50%', translate: '-50%' }}
                        onClick={handleBottomSheetOpen}
                    >
                        산책하기
                    </Button>
                )}
            </main>
            <Navbar />
            <BottomSheet isOpen={isDogBottomSheetOpen} onClose={handleBottomSheetClose}>
                <BottomSheet.Header> 강아지 산책</BottomSheet.Header>
                <BottomSheet.Body isLoading={isAvailableDogsLoading}>
                    {isArrayNotEmpty(walkAvailableDogs) ? (
                        <AvailableDogCheckList
                            dogs={walkAvailableDogs}
                            onToggle={handleToggle}
                            checkAll={handleCheckAll}
                        />
                    ) : (
                        <div>모든 강아지가 산책중입니다</div>
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

const HomeHeader = () => {
    return (
        <TopBar className="bg-neutral-50 px-5">
            <TopBar.Front></TopBar.Front>
            <TopBar.Center></TopBar.Center>
            <TopBar.Back>
                <img src={Notification} alt="알림" />
            </TopBar.Back>
        </TopBar>
    );
};

export default Home;
