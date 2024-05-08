import React from 'react';
import SelectPhoto from '@/assets/icons/ic-select-photo.svg';
import { Divider } from '@/components/common/Divider';

export default function DogRegister1() {
    return (
        <div className="flex flex-col bg-white">
            <div>
                <span className="text-amber-500 text-xl font-semibold leading-[30px]">반려견의 기본 정보</span>
                <span className="text-neutral-800 text-xl font-semibold leading-[30px]">
                    를
                    <br />
                    알려주세요 :)
                </span>
            </div>
            <div className="mt-8 mb-6 flex justify-center">
                <img src={SelectPhoto} alt="selectphoto" className="size-[7.5rem]" />
            </div>
            <div className="flex flex-col gap-12">
                <div className="py-3 relative">
                    <input type="text" placeholder="이름이 궁금해요" className="outline-none" />
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
                <div className="py-3 relativeelative">
                    <input type="text" placeholder="견종이 궁금해요" className="outline-none" />
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
            </div>
        </div>
    );
}
