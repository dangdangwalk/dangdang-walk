import queryClient from '@/api/queryClient';
import Camera from '@/pages/Camera';
import Health from '@/pages/Health';
import Home from '@/pages/Home';
import Join from '@/pages/Join';
import JournalCreateForm from '@/pages/Journals/CreateForm';
import OauthCallback from '@/pages/OauthCallback';
import Profile from '@/pages/Profile';
import Walk from '@/pages/Walk';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <CookiesProvider>
                <App />
            </CookiesProvider>
        ),
        children: [
            {
                index: true,
                path: '/',
                element: <Home />,
            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/health',
                element: <Health />,
            },
            {
                path: '/join',
                element: <Join />,
            },
            {
                path: '/walk',
                element: <Walk />,
            },
            {
                path: '/callback',
                element: <OauthCallback />,
            },
            {
                path: '/camera',
                element: <Camera />,
            },
            {
                path: '/journals/create',
                element: <JournalCreateForm />,
            },
        ],
    },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
    </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
