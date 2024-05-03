import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/api/queryClient';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col">
                <div className="bg-yellow-300">
                    <Outlet />
                </div>
                <Navbar />
            </div>
        </QueryClientProvider>
    );
}

export default App;
