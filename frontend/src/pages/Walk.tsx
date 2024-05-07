import Topbar from '@/components/common/Topbar';
import { useState } from 'react';
import Notification from '@/assets/icons/notification.svg';
import DogBottomSheet from '@/components/walk/DogBottomSheet';
import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import Ic from '@/assets/icons/ic.svg';
import WalkNavbar from '@/components/walk/WalkNavbar';
import { useNavigate } from 'react-router-dom';
export default function Walk() {
    const [isWalk, setIsWalk] = useState<boolean>(true);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    return (
        <div>
            {isWalk && (
                <Topbar>
                    <Topbar.Front onClick={goBack}>
                        <img className="rotate-180" src={Ic} alt="back button" />
                    </Topbar.Front>
                    <Topbar.Center className="text-center text-black text-lg font-bold leading-[27px]">
                        산책하기
                    </Topbar.Center>
                    <Topbar.Back className="w-12 flex items-center justify-end">
                        <img src={Notification} alt="Notification" />
                    </Topbar.Back>
                </Topbar>
            )}
            <WalkInfo />
            <Map />
            <WalkNavbar />

            {isWalk && <DogBottomSheet />}
        </div>
    );
}
