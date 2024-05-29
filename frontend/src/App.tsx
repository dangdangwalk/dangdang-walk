import { Toast } from '@/components/common/Toast';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSpinnerStore } from '@/store/spinnerStore';
import Spinner from '@/components/common/Spinner';
// var console;
function App() {
    const { spinner } = useSpinnerStore();
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

    return (
        <div className="flex flex-col w-full">
            <Outlet />
            {spinner > 0 && <Spinner className="absolute bg-neutral-800/40 z-40" />}
            <Toast />
        </div>
    );
}

export default App;
