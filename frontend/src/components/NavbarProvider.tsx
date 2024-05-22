import Navbar from '@/components/Navbar';
import React from 'react';
interface Props {
    children: React.ReactNode;
}
export default function NavbarProvider({ children }: Props) {
    return (
        <>
            {children}
            <Navbar />
        </>
    );
}
