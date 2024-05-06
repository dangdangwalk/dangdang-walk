import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import React, { useEffect, useRef } from 'react';
import queryClient from './api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useLoginModalStateStore } from './store/modalStateStore';
import LoginModal from '@/components/LoginModal';
var console;
function App() {
    const { isLoginModalOpen: isModalOpen, isJoinning, setLoginModalState: setModalState } = useLoginModalStateStore();
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
            outletRef.current.addEventListener('click', () => setModalState(false));
        }

        return () => {
            if (outletRef.current) {
                outletRef.current.removeEventListener('click', () => setModalState(false));
            }
        };
    }, [setModalState]);
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col">
                <div ref={outletRef}>
                    <Outlet />
                </div>
                {!isJoinning && (
                    <div className={`fixed z-10`}>
                        <Navbar />
                    </div>
                )}
                {!isJoinning && (
                    <div
                        className={`fixed z-20 w-full duration-300 ${isModalOpen ? ' translate-y-72' : 'translate-y-full'}`}
                    >
                        <LoginModal />
                    </div>
                )}
            </div>
        </QueryClientProvider>
    );
}

export default App;
