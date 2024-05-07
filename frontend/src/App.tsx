import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import React, { useEffect, useRef } from 'react';
import queryClient from './api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useLoginBottomSheetStateStore } from './store/loginBottomSheetStore';
import LoginBottomSheet from '@/components/LoginBottomSheet';
var console;
function App() {
    const { isLoginBottomSheetOpen, setLoginBottomSheetState } = useLoginBottomSheetStateStore();
    const location = useLocation();
    const currentPage = location.pathname;
    const outletRef = useRef<HTMLDivElement>(null);
    //TODO: 일시적인 배포시 console.log 제거 추가로 환경설정으로 빼줘야함ㄴ
    if (process.env.NODE_ENV === 'production') {
        console = window.console || {};
        console.log = function no_console() {};
        console.warn = function no_console() {};
        console.error = function () {};
    }
    useEffect(() => {
        if (outletRef.current) {
            outletRef.current.addEventListener('click', () => setLoginBottomSheetState(false));
        }

        return () => {
            if (outletRef.current) {
                outletRef.current.removeEventListener('click', () => setLoginBottomSheetState(false));
            }
        };
    }, [setLoginBottomSheetState]);
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col w-full">
                <div ref={outletRef}>
                    <Outlet />
                </div>
                {currentPage !== '/join' && (
                    <>
                        <div className={`fixed z-10`}>
                            <Navbar />
                        </div>
                        <div
                            className={`fixed z-20 w-full duration-300 ${isLoginBottomSheetOpen ? ' translate-y-72' : 'translate-y-full'}`}
                        >
                            <LoginBottomSheet />
                        </div>
                    </>
                )}
            </div>
        </QueryClientProvider>
    );
}

export default App;
