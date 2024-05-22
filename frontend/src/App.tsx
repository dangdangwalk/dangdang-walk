import { Toast } from '@/components/common/Toast';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSpinnerStore } from '@/store/spinnerStore';
import Spinner from '@/components/common/Spinner';
import { useAuth } from '@/hooks/useAuth';
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
    const { refreshTokenQuery } = useAuth();
    useEffect(() => {
        window.onpageshow = function (event) {
            if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
                // Back Forward Cache로 브라우저가 로딩될 경우 혹은 브라우저 뒤로가기 했을 경우
                // 이벤트 추가하는 곳
                window.location.reload();
                console.log('back button event');
            }
        };
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    }, []);

    if (refreshTokenQuery.isPending) {
        return (
            <>
                <Spinner className="absolute bg-neutral-800/40 z-40" />
            </>
        );
    }
    return (
        <div className="flex flex-col w-full">
            {<Outlet />}
            {spinner > 0 && <Spinner className="absolute bg-neutral-800/40 z-40" />}
            <Toast />
        </div>
    );
}

export default App;
