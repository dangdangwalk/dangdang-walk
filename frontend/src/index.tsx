import Health from '@/pages/Health';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Join from '@/pages/Join';
import Walk from '@/pages/Walk';
import OauthCallback from '@/pages/OauthCallback';
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
        ],
    },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
