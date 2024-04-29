import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import myPageOff from '@/assets/icons/navbar/mypage_off.svg';
import myPageOn from '@/assets/icons/navbar/mypage_on.svg';
import WalkOff from '@/assets/icons/navbar/walk_off.svg';
import WalkOn from '@/assets/icons/navbar/walk_on.svg';
const Navbar = () => {
  const location = useLocation();
  return (
    <div className='fixed w-full left-0 bottom-0 border-t border-slate-300 h-20 mb-6'>
      <div className='flex justify-around items-center'>
        <Link to='/'>
          {location.pathname === '/' ? (
            <img src={myPageOn} alt='Walk On' />
          ) : (
            <img src={myPageOff} alt='Walk Off' />
          )}
        </Link>
        <Link to='/profile'>
          {location.pathname === '/profile' ? (
            <img src={WalkOn} alt='MyPage On' />
          ) : (
            <img src={WalkOff} alt='MyPage Off' />
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
