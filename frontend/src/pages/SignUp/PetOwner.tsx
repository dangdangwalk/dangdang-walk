import { DogRegHeader } from '@/components/dogRegistration/DogRegHeader';
import React from 'react';
interface Props {
    haveADog: boolean;
    handleHaveADogChange: (haveADog: boolean) => void;
}
export default function PetOwner({ haveADog, handleHaveADogChange }: Props) {
    return (
        <div className={`flex flex-col bg-white`}>
            <DogRegHeader>
                <DogRegHeader.Section1>해당되는 항목</DogRegHeader.Section1>
                <DogRegHeader.Section2>
                    을
                    <br />
                    선택해주세요!
                </DogRegHeader.Section2>
            </DogRegHeader>

            <div className="mx-2.5 mt-12 flex flex-col gap-3">
                <button
                    onClick={() => handleHaveADogChange(true)}
                    className={`border duration-100 active:scale-95 ${
                        haveADog ? 'border-primary' : 'border-secondary'
                    } flex w-full flex-col items-center justify-center rounded-lg bg-primary-foreground`}
                >
                    <div className="my-6">
                        <div className={`text-base ${haveADog ? 'text-neutral-800' : 'text-stone-500'} font-bold`}>
                            반려견을 키우고 있어요
                        </div>
                        <div className={`text-xs ${haveADog ? 'text-neutral-800' : 'text-neutral-400'} font-normal`}>
                            나의 반려견 정보 입력하기
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => handleHaveADogChange(false)}
                    className={`border duration-100 active:scale-95 ${
                        !haveADog ? 'border-primary' : 'border-secondary'
                    } flex w-full flex-col items-center justify-center rounded-lg bg-primary-foreground`}
                >
                    <div className="my-6">
                        <div className={`text-base ${!haveADog ? 'text-neutral-800' : 'text-stone-500'} font-bold`}>
                            반려견을 키우고 있지 않아요
                        </div>
                        <div className={`text-xs ${!haveADog ? 'text-neutral-800' : 'text-neutral-400'} font-normal`}>
                            반려견 등록 없이 간편가입
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
