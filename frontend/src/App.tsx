import LoginAlertModal from '@/components/LoginAlertModal';
import OAuthButton from '@/components/OAuthButton';
import BottomSheet from '@/components/common/BottomSheet';
import { OAUTH } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
// var console;
function App() {
    const location = useLocation();
    const currentPage = location.pathname;
    const { isLoggedIn } = useAuth();
    //TODO: 일시적인 배포시 console.log 제거 추가로 환경설정으로 빼줘야함ㄴ
    // if (process.env.NODE_ENV === 'production') {
    //     console = window.console || {};
    //     console.log = function no_console() {};
    //     console.warn = function no_console() {};
    //     console.error = function () {};
    // }

    useEffect(() => {
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    }, []);
    const [isLoginBottomSheetOpen, setLoginBottomSheetState] = useState(false);
    const handleClose = () => {
        setLoginBottomSheetState(false);
    };
    const handleToggle = (toggle: boolean) => {
        setLoginBottomSheetState(toggle);
    };
    return (
        <div className="flex flex-col w-full">
            <div>
                <Outlet />
                {(currentPage === '/' || currentPage === '/profile') && (
                    <div>
                        <Navbar />
                        {!isLoggedIn && !isLoginBottomSheetOpen && (
                            <LoginAlertModal isOpen={isLoginBottomSheetOpen} setToggle={handleToggle} />
                        )}

                        <BottomSheet isOpen={isLoginBottomSheetOpen} onClose={handleClose}>
                            <BottomSheet.Body className="h-[230px]">
                                <div className="flex flex-col items-center gap-3 mx-2 mt-4 mb-5">
                                    {OAUTH.map((oauth, index) => (
                                        <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} />
                                    ))}
                                </div>
                            </BottomSheet.Body>
                        </BottomSheet>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
