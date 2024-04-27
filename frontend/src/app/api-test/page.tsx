'use client';

import axios, { AxiosError } from 'axios';
import { useState } from 'react';

export default function ApiTest() {
    const [text, setText] = useState('이곳에 결과가 표시됩니다.');

    return (
        <main className="flex min-h-screen flex-col items-center p-24 gap-5">
            <button className="bg-red-400 p-4 rounded-md" onClick={handleClick}>
                API에 요청 보내기
            </button>
            <div>{text}</div>
        </main>
    );

    async function handleClick() {
        try {
            const res = await axios.get('localhost:3333/health');

            setText(res.data);
        } catch (err) {
            if (err instanceof AxiosError) {
                setText(err.message);
            }
        }
    }
}
