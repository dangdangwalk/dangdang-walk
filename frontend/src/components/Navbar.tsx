import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import myPageOff from '@/assets/icons/btn-mypage-off.svg';
import myPageOn from '@/assets/icons/btn-mypage-on.svg';
import WalkOff from '@/assets/icons/btn-walk-off.svg';
import WalkOn from '@/assets/icons/btn-walk-on.svg';

interface Props {
    isLoginModalOpen: boolean;
}
function Navbar({ isLoginModalOpen }: Props) {
    const location = useLocation();
    const currentPath = window.location.pathname;
    if (currentPath === '/login') return null;

    return (
        <div className="fixed w-full h-[3.75rem] left-0 bottom-0 border-t bg-white border-neutral-200 px-5">
            <div className="flex justify-around items-center">
                <Link to="/">
                    {location.pathname === '/' ? (
                        <img src={WalkOn} alt="Walk On" />
                    ) : (
                        <img src={WalkOff} alt="Walk Off" />
                    )}
                </Link>
                <Link to="/profile">
                    {location.pathname === '/profile' ? (
                        <img src={myPageOn} alt="MyPage On" />
                    ) : (
                        <img src={myPageOff} alt="MyPage Off" />
                    )}
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
