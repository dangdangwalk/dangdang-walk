import { Toast } from '@/components/commons/Toast';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSpinnerStore } from '@/store/spinnerStore';
import Spinner from '@/components/commons/Spinner';
import { useAuth } from '@/hooks/useAuth';

function App() {
    useAuth();
    const { spinnerCount } = useSpinnerStore();

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
