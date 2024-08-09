import queryClient from '@/api/queryClient';
import AuthLayout from '@/components/AuthLayout';
import Health from '@/pages/Health';
import Home from '@/pages/Home';
import Journals from '@/pages/Journals';
import JournalCreateForm from '@/pages/Journals/CreateForm';
import Detail from '@/pages/Journals/Detail';
import MyPage from '@/pages/MyPage';
import OauthCallback from '@/pages/OauthCallback';
import SignUp from '@/pages/SignUp';
import Walk from '@/pages/Walk';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import NotFound from '@/components/error/NotFound';
import WithAuthenticated from '@/components/commons/WithAuthenticated';

const router = createBrowserRouter([
    { path: '*', element: <NotFound /> },
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                path: '/',
                element: (
                    <AuthLayout>
                        <Home />
                    </AuthLayout>
                ),
            },
            {
                path: '/mypage',
                element: (
                    <AuthLayout>
                        <MyPage />
                    </AuthLayout>
                ),
            },
            {
                path: '/health',
                element: <Health />,
            },
            {
                path: '/signup',
                element: <SignUp />,
            },
            {
                path: '/walk',
                element: (
                    <WithAuthenticated>
                        <Walk />
                    </WithAuthenticated>
                ),
            },
            {
                path: '/callback',
                element: <OauthCallback />,
            },
            {
                path: '/journals/create',
                element: (
                    <WithAuthenticated>
                        <JournalCreateForm />
                    </WithAuthenticated>
                ),
            },
            {
                path: '/journals',
                element: (
                    <WithAuthenticated>
                        <AuthLayout>
                            <Journals />
                        </AuthLayout>
                    </WithAuthenticated>
                ),
            },
            {
                path: '/journals/:journalId',
                element: (
                    <WithAuthenticated>
                        <Detail />
                    </WithAuthenticated>
                ),
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
