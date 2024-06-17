import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import myPageOff from '@/assets/buttons/btn-mypage-off.svg';
import myPageOn from '@/assets/buttons/btn-mypage-on.svg';
import WalkOff from '@/assets/buttons/btn-walk-off.svg';
import WalkOn from '@/assets/buttons/btn-walk-on.svg';
import { NAV_HEIGHT } from '@/constants';

function Navbar() {
    const location = useLocation();
    const currentPath = window.location.pathname;
    if (currentPath === '/login') return null;

    return (
        <div
            className={`fixed bottom-0 z-20 w-full max-w-screen-sm border-t border-neutral-200 bg-white px-5`}
            style={{ height: `${NAV_HEIGHT}` }}
        >
            <div className="flex items-center justify-around">
                <Link to="/">
                    {location.pathname === '/' ? (
                        <img src={WalkOn} alt="Walk On" />
                    ) : (
                        <img src={WalkOff} alt="Walk Off" />
                    )}
                </Link>
                <Link to="/mypage">
                    {location.pathname === '/mypage' ? (
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
