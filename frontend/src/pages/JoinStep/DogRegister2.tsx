import React, { FormEvent } from 'react';
import Male from '@/assets/icons/ic-sex-male.svg';
import FeMale from '@/assets/icons/ic-sex-femal.svg';
import { Divider } from '@/components/common/Divider';
import { Checkbox } from '@/components/common/Checkbox2';
import { Gender } from '@/models/dog.model';
interface Props {
    gender: Gender;
    handleGenderChange: (gender: Gender) => void;
}
export interface DogDetailInfo {
    gender: Gender;
    isNeatered: boolean;
    birth?: Date;
    notSureBday: boolean;
    weight: number;
}
export default function DogRegister2({ gender, handleGenderChange }: Props) {
    function maxLengthCheck(event: FormEvent<HTMLInputElement>) {
        const object = event.currentTarget;
        if (object.value.length > object.maxLength) {
            object.value = object.value.slice(0, object.maxLength);
        }
    }
    return (
        <div className="flex flex-col bg-white">
            <div>
                <span className="text-amber-500 text-xl font-semibold leading-[30px]">이름의 세부 정보</span>
                <span className="text-neutral-800 text-xl font-semibold leading-[30px]">
                    를
                    <br />
                    알려주세요 :)
                </span>
            </div>
            <div className="mt-8 text-stone-500 text-sm font-normal leading-[21px]">성별</div>
            <div className="mt-3 inline-flex gap-2">
                <button
                    onClick={() => handleGenderChange('MALE')}
                    className={`border ${
                        gender === 'MALE' ? 'border-primary' : 'border-secondary'
                    } bg-primary-foreground  rounded-lg w-full flex flex-col items-center justify-center`}
                >
                    <div className="flex flex-col justify-center items-center gap-1 my-5 mx-6">
                        <div
                            className={`text-base ${
                                gender === 'MALE' ? 'text-neutral-800' : 'text-stone-500'
                            }  font-bold`}
                        >
                            <img src={Male} alt="male" />
                        </div>
                        <div
                            className={`text-xs ${
                                gender === 'MALE' ? 'text-neutral-800' : 'text-neutral-400'
                            }  font-normal`}
                        >
                            남아
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => handleGenderChange('FEMALE')}
                    className={`border ${
                        gender === 'FEMALE' ? 'border-primary' : 'border-secondary'
                    } bg-primary-foreground  rounded-lg w-full flex flex-col items-center justify-center`}
                >
                    <div className="flex flex-col justify-center items-center gap-1 my-5 mx-6">
                        <div
                            className={`text-base ${
                                gender === 'FEMALE' ? 'text-neutral-800' : 'text-stone-500'
                            }  font-bold`}
                        >
                            <img src={FeMale} alt="female" />
                        </div>
                        <div
                            className={`text-xs ${
                                gender === 'FEMALE' ? 'text-neutral-800' : 'text-neutral-400'
                            }  font-normal`}
                        >
                            여아
                        </div>
                    </div>
                </button>
            </div>
            <div className="mt-2">
                <Checkbox
                    checked={true}
                    onCheckedChange={(checked: boolean) => {
                        console.log(checked);
                    }}
                    labelText="중성화 했어요"
                />
            </div>
            <div className="mt-8">
                <div className="py-3 relative">
                    <input type="text" placeholder="이름의 생일이 궁금해요" className="outline-none" />
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
                <Checkbox
                    checked={true}
                    onCheckedChange={(checked: boolean) => {
                        console.log(checked);
                    }}
                    labelText="생일을 몰라요"
                />
            </div>
            <div className="mt-9">
                <div className="py-3 relative">
                    <input
                        type="number"
                        pattern="\d*"
                        inputMode="decimal"
                        placeholder="이름의 체중이 궁금해요"
                        className="outline-none"
                        maxLength={3}
                        onInput={(e) => maxLengthCheck(e)}
                    />
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
            </div>
        </div>
    );
}
