import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/api/queryClient';

var console;
function App() {
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

                <Navbar />
            </div>
        </QueryClientProvider>
    );
}

export default App;
