import React from 'react';
interface Props {
    haveADog: boolean;
    handleHaveADogChange: (haveADog: boolean) => void;
}
export default function PetOwner({ haveADog, handleHaveADogChange }: Props) {
    return (
        <div className={`flex flex-col bg-white`}>
            <div>
                <span className="text-amber-500 text-xl font-semibold leading-[30px]">해당되는 항목</span>
                <span className="text-neutral-800 text-xl font-semibold leading-[30px]">
                    을
                    <br />
                    선택해주세요!
                </span>
            </div>

            <div className="flex flex-col gap-3 mx-[0.625rem] mt-12">
                <button
                    onClick={() => handleHaveADogChange(true)}
                    className={`border ${
                        haveADog ? 'border-primary' : 'border-secondary'
                    } bg-primary-foreground  rounded-lg w-full flex flex-col items-center justify-center`}
                >
                    <div className="my-6">
                        <div className={`text-base ${haveADog ? 'text-neutral-800' : 'text-stone-500'}  font-bold`}>
                            반려견을 키우고 있어요
                        </div>
                        <div className={`text-xs ${haveADog ? 'text-neutral-800' : 'text-neutral-400'}  font-normal`}>
                            나의 반려견 정보 입력하기
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => handleHaveADogChange(false)}
                    className={`border ${
                        !haveADog ? 'border-primary' : 'border-secondary'
                    } bg-primary-foreground  rounded-lg w-full flex flex-col items-center justify-center`}
                >
                    <div className="my-6">
                        <div className={`text-base ${!haveADog ? 'text-neutral-800' : 'text-stone-500'}  font-bold`}>
                            반려견을 키우고 있지 않아요
                        </div>
                        <div className={`text-xs ${!haveADog ? 'text-neutral-800' : 'text-neutral-400'}  font-normal`}>
                            반려견 등록 없이 간편가입
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
