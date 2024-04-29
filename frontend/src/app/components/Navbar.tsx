import Link from 'next/link';
import React from 'react';

export default function Navbar() {
    return (
        <div className="flex gap-2 border border-red-400 justify-center">
            <Link href="/">
                <div className="bg-yellow-600 p-2 rounded-md">산책</div>
            </Link>
            <Link href="/profile">
                <div className="bg-yellow-600 p-2 rounded-md">내 정보</div>
            </Link>
        </div>
    );
}
