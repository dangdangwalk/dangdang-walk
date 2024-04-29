'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
    const { data: session } = useSession();
    return (
        <div className="flex flex-col items-center">
            <p>산책페이지</p>
            {session && (
                <div className="flex flex-col justify-center">
                    <p>{session.user?.name}님 산책 ㄱㄱ?</p>
                    <button className="bg-red-400" onClick={() => signOut()}>
                        로그아웃
                    </button>
                </div>
            )}
            <Link href="/walk">
                <div className="bg-amber-400 p-3 rounded-md flex justify-center">산책하기</div>
            </Link>
        </div>
    );
}
