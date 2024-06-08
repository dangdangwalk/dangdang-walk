import TopBar from '@/components/commons/TopBar';
import Ic from '@/assets/icons/ic-arrow-right.svg';
import { useNavigate } from 'react-router-dom';
import Notification from '@/assets/icons/ic-notification.svg';
export default function WalkHeader() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    return (
        <>
            <TopBar className="px-5">
                <TopBar.Front onClick={goBack}>
                    <img className="rotate-180" src={Ic} alt="back button" />
                </TopBar.Front>
                <TopBar.Center className="text-center text-lg font-bold leading-[27px] text-black">
                    산책하기
                </TopBar.Center>
                <TopBar.Back className="flex w-12 items-center justify-end">
                    <img src={Notification} alt="Notification" />
                </TopBar.Back>
            </TopBar>
        </>
    );
}
