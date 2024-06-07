import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import FemaleIcon from '@/components/icons/FemaleIcon';
import { MaleIcon } from '@/components/icons/MaleIcon';
import { DogCreateForm } from '@/models/dog';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
interface Props {
    data: DogCreateForm;
    setData: Dispatch<SetStateAction<DogCreateForm>>;
}
export interface DogDetailInfoProps {
    gender: string;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
}
export function maxLengthCheck(event: FormEvent<HTMLInputElement>) {
    const object = event.currentTarget;
    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    }
}
export default function DogDetailInfo({ data, setData }: Props) {
    const [weight, setWeight] = useState('');

    const handleGenderChange = (gender: string) => {
        setData((prev) => ({
            ...prev,
            gender,
        }));
    };
    const handleWeightChange = (weight: string) => {
        setData((prev) => ({
            ...prev,
            weight: Number(weight),
        }));
    };
    const handleBirthChange = (birth: string) => {
        setData((prev) => ({
            ...prev,
            birth,
        }));
    };

    const [birthCheck, setBirthCheck] = useState(false);
    return (
        <div className="flex flex-col bg-white">
            <div>
                <span className="text-xl font-semibold leading-[30px] text-amber-500">{data.name}의 세부 정보</span>
                <span className="text-xl font-semibold leading-[30px] text-neutral-800">
                    를
                    <br />
                    알려주세요 :)
                </span>
            </div>
            <div className="mt-8 text-sm font-normal leading-[21px] text-stone-500">성별</div>
            <div className="mt-3 inline-flex gap-2">
                <button
                    onClick={() => handleGenderChange('MALE')}
                    className={`border ${
                        data.gender === 'MALE' ? 'border-primary' : 'border-secondary'
                    } flex w-full flex-col items-center justify-center rounded-lg bg-primary-foreground`}
                >
                    <div className="mx-6 my-5 flex flex-col items-center justify-center gap-1">
                        <div
                            className={`text-base ${
                                data.gender === 'MALE' ? 'text-neutral-800' : 'text-stone-500'
                            } font-bold`}
                        >
                            <MaleIcon color={`${data.gender === 'MALE' ? '#222222' : '#999999'}`} />
                        </div>
                        <div
                            className={`text-xs ${
                                data.gender === 'MALE' ? 'text-neutral-800' : 'text-neutral-400'
                            } font-normal`}
                        >
                            남아
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => handleGenderChange('FEMALE')}
                    className={`border ${
                        data.gender === 'FEMALE' ? 'border-primary' : 'border-secondary'
                    } flex w-full flex-col items-center justify-center rounded-lg bg-primary-foreground`}
                >
                    <div className="mx-6 my-5 flex flex-col items-center justify-center gap-1">
                        <div
                            className={`text-base ${
                                data.gender === 'FEMALE' ? 'text-neutral-800' : 'text-stone-500'
                            } font-bold`}
                        >
                            <FemaleIcon color={`${data.gender === 'FEMALE' ? '#222222' : '#999999'}`} />
                        </div>
                        <div
                            className={`text-xs ${
                                data.gender === 'FEMALE' ? 'text-neutral-800' : 'text-neutral-400'
                            } font-normal`}
                        >
                            여아
                        </div>
                    </div>
                </button>
            </div>
            <div className="mt-2">
                <Checkbox
                    checked={data.isNeutered}
                    onCheckedChange={(checked: boolean) => {
                        setData((prev) => ({
                            ...prev,
                            isNeutered: checked,
                        }));
                    }}
                    labelText="중성화 했어요"
                />
            </div>
            <div className={`${birthCheck ? 'mt-4' : 'mt-8'}`}>
                <div className={`${birthCheck ? '' : 'relative mb-2 py-3'} `}>
                    {!birthCheck && (
                        <>
                            <input
                                type="date"
                                placeholder={`${data.name}의 생일이 궁금해요`}
                                className="w-full font-bold outline-none"
                                onChange={(event) => handleBirthChange(event.target.value)}
                            />
                            <Divider className="absolute bottom-0 h-[1px]" />
                        </>
                    )}
                </div>
                <Checkbox
                    checked={birthCheck}
                    onCheckedChange={(checked: boolean) => {
                        setBirthCheck(checked);

                        setData((prev) => ({
                            ...prev,
                            birth: null,
                        }));
                    }}
                    labelText="생일을 몰라요"
                />
            </div>
            <div className="mt-9">
                <div className={`relative py-3 ${weight && 'font-bold'}`}>
                    <input
                        value={weight}
                        type="number"
                        pattern="\d*"
                        inputMode="numeric"
                        placeholder={`${data.name}의 체중이 궁금해요`}
                        className={`outline-none ${weight && 'w-9'}`}
                        maxLength={3}
                        onInput={(e) => maxLengthCheck(e)}
                        onChange={(event) => {
                            setWeight(event.target.value);
                            handleWeightChange(event.target.value);
                        }}
                    />
                    {weight && 'kg'}
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
            </div>
        </div>
    );
}
