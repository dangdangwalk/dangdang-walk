import React from 'react';
import DangDang from '@/assets/icons/ic-dang-dang.svg';
import { Button } from '@/components/commons/Button';
import { useNavigate } from 'react-router-dom';
export default function NotFound() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center px-4">
            <img className="w-[360px]" src={DangDang} alt="댕댕워크" />
            <div className="mb-4">
                <p className="mb-2 text-3xl font-bold">404 ERROR</p>
                <p>죄송합니다. 페이지를 찾을 수 없습니다.</p>
                <p>존재하지 않는 주소를 입력하셨거나</p>
                <p>요청하신 페이지의 주소가 변경 삭제되어 찾을 수 없습니다.</p>
            </div>
            <Button rounded={'small'} onClick={goHome}>
                홈으로
            </Button>
        </div>
    );
}
