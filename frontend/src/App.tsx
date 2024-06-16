import Spinner from '@/components/commons/Spinner';
import { Toast } from '@/components/commons/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

function App() {
    useAuth();
    const spinnerCount = useStore((state) => state.spinnerCount);

    useEffect(() => {
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    }, []);

    return (
        <div className="flex w-full flex-col">
            <Outlet />
            {spinnerCount > 0 && <Spinner className="absolute z-40 bg-neutral-800/40" />}
            <Toast />
        </div>
    );
}

export default App;
