import Topbar from '@/components/common/Topbar';
import Ic from '@/assets/icons/ic-arrow.svg';
import { useNavigate } from 'react-router-dom';
import Notification from '@/assets/icons/notification.svg';
import { Divider } from '@/components/common/Divider';
export default function WalkHeader() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    return (
        <>
            <Topbar>
                <Topbar.Front onClick={goBack}>
                    <img className="rotate-180" src={Ic} alt="back button" />
                </Topbar.Front>
                <Topbar.Center className="text-center text-lg font-bold leading-[27px] text-black">
                    산책하기
                </Topbar.Center>
                <Topbar.Back className="flex w-12 items-center justify-end">
                    <img src={Notification} alt="Notification" />
                </Topbar.Back>
            </Topbar>
            <Divider className="h-0.5" />
        </>
    );
}
