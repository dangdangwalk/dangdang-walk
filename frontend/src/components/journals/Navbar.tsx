import { ReactComponent as MyPageOff } from '@/assets/icons/btn-mypage-off.svg';
import { ReactComponent as WalkOn } from '@/assets/icons/btn-walk-on.svg';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className={`w-full h-16 border-t bg-white border-neutral-200 px-5`}>
            <div className="flex justify-around items-center">
                <Link to="/">
                    <WalkOn />
                </Link>
                <Link to="/profile">
                    <MyPageOff />
                </Link>
            </div>
        </div>
    );
}
