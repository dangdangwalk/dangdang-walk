import { Divider } from '@/components/common/Divider';
import useGeolocation from '@/hooks/useGeolocation';
import { useWalkStore } from '@/store/walkStore';
import { distanceFormat } from '@/utils/format';
import React from 'react';

export default function WalkInfo() {
    const { walkStart, walkStop } = useWalkStore();
    const { distance } = useGeolocation();
    const handleStart = () => {
        console.log('start');
        walkStart();
    };
    const handleStop = () => {
        console.log('stop');
        walkStop();
    };
    return (
        <div className="w-full h-16 px-5 mt-4 pb-1 bg-white justify-between items-center gap-2.5 inline-flex ">
            <div className="flex flex-col h-15 w-20 justify-center items-center">
                <div className=" text-amber-500 text-lg font-bold leading-[27px]">{distanceFormat(distance)}</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">km</div>
            </div>
            <Divider orientation={'vertical'} />
            <div className="flex flex-col w-20 justify-center items-center">
                <div className="text-amber-500 text-lg font-bold leading-[27px]">129</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">kcal</div>
            </div>
            <Divider orientation={'vertical'} />
            <div className="flex flex-col w-20 justify-center items-center">
                <div className="text-amber-500 text-lg font-bold leading-[27px]">1:30</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">시간</div>
            </div>
        </div>
    );
}
