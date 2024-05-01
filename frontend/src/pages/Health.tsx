import axios from 'axios';
import { useState } from 'react';

export default function Health() {
    const [isSuccess, setIsSuccess] = useState(false);

    return (
        <div className="flex flex-col text-center p-10 gap-5">
            <div>
                <button className="p-3 border-2 rounded-md border-black bg-slate-200" onClick={handleClick}>
                    백엔드와 통신하기
                </button>
            </div>
            <div>콘솔에 결과가 출력됩니다.</div>
            {isSuccess ? <div className="text-green-500 font-bold">🎉🎉 통신 성공 🎉🎉</div> : null}
        </div>
    );

    async function handleClick() {
        const res = await axios.get('http://localhost:3333/health');
        console.log(res);
    }
}
