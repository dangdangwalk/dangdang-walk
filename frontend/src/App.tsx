import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useState } from 'react';
import React from 'react';
import queryClient from './api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useModalStateStore } from './store/modalStateStore';
import LoginModal from '@/components/LoginModal';
var console;
function App() {
    const [isLoginModalOpen] = useState(true);
    const { isModalOpen } = useModalStateStore();
    //TODO: 일시적인 배포시 console.log 제거 추가로 환경설정으로 빼줘야함ㄴ
    if (process.env.NODE_ENV === 'production') {
        console = window.console || {};
        console.log = function no_console() {};
        console.warn = function no_console() {};
        console.error = function () {};
    }
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col">
                <Outlet />
                <div className={`fixed z-10`}>
                    <Navbar isLoginModalOpen={isLoginModalOpen} />
                </div>

                <div
                    className={`fixed z-20 w-full duration-300 ${isModalOpen ? 'translate-y-72' : 'translate-y-full'}`}
                >
                    <LoginModal />
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default App;
