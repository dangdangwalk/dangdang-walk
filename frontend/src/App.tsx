import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <div className="flex flex-col">
            <Outlet />
            <Navbar />
        </div>
    );
}

export default App;
