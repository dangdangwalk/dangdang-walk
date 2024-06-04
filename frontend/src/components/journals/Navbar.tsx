import { ReactComponent as MyPageOff } from '@/assets/icons/btn-mypage-off.svg';
import { ReactComponent as WalkOn } from '@/assets/icons/btn-walk-on.svg';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className={`h-16 w-full border-t border-neutral-200 bg-white px-5`}>
            <div className="flex items-center justify-around">
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
