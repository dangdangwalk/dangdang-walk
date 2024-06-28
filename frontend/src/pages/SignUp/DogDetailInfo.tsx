import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import { DogRegHeader } from '@/components/dogRegistration/DogRegHeader';
import FemaleIcon from '@/components/icons/FemaleIcon';
import { MaleIcon } from '@/components/icons/MaleIcon';
import { Dog } from '@/models/dog';
import { FormEvent, useState } from 'react';

type DogDetailInfoProps = Pick<Dog, 'name' | 'gender' | 'isNeutered'>;
interface Props {
    data: DogDetailInfoProps;
    handleSetData: (key: string, value: string | boolean | null | number) => void;
}

export function maxLengthCheck(event: FormEvent<HTMLInputElement>) {
    const object = event.currentTarget;
    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    }
}
export default function DogDetailInfo({ data, handleSetData }: Props) {
    const { name, gender, isNeutered } = data;
    const [weight, setWeight] = useState('');
    const [birthCheck, setBirthCheck] = useState(false);
    return (
        <div className="flex flex-col bg-white">
            <DogRegHeader>
                <DogRegHeader.Section1>{name}의 세부 정보</DogRegHeader.Section1>
                <DogRegHeader.Section2>
                    를
                    <br />
                    알려주세요 :)
                </DogRegHeader.Section2>
            </DogRegHeader>
            <div className="mt-8 text-sm font-normal leading-[21px] text-stone-500">성별</div>
            <div className="mt-3 inline-flex gap-2">
                <button
                    onClick={() => handleSetData('gender', 'MALE')}
                    className={`border ${
                        gender === 'MALE' ? 'border-primary' : 'border-secondary'
                    } flex w-full flex-col items-center justify-center rounded-lg bg-primary-foreground duration-100 active:scale-95`}
                >
                    <div className="mx-6 my-5 flex flex-col items-center justify-center gap-1">
                        <div
                            className={`text-base ${
                                gender === 'MALE' ? 'text-neutral-800' : 'text-stone-500'
                            } font-bold`}
                        >
                            <MaleIcon color={`${gender === 'MALE' ? '#222222' : '#999999'}`} />
                        </div>
                        <div
                            className={`text-xs ${
                                gender === 'MALE' ? 'text-neutral-800' : 'text-neutral-400'
                            } font-normal`}
                        >
                            남아
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => handleSetData('gender', 'FEMALE')}
                    className={`border ${
                        gender === 'FEMALE' ? 'border-primary' : 'border-secondary'
                    } flex w-full flex-col items-center justify-center rounded-lg bg-primary-foreground duration-100 active:scale-95`}
                >
                    <div className="mx-6 my-5 flex flex-col items-center justify-center gap-1">
                        <div
                            className={`text-base ${
                                gender === 'FEMALE' ? 'text-neutral-800' : 'text-stone-500'
                            } font-bold`}
                        >
                            <FemaleIcon color={`${gender === 'FEMALE' ? '#222222' : '#999999'}`} />
                        </div>
                        <div
                            className={`text-xs ${
                                gender === 'FEMALE' ? 'text-neutral-800' : 'text-neutral-400'
                            } font-normal`}
                        >
                            여아
                        </div>
                    </div>
                </button>
            </div>
            <div className="mt-2">
                <Checkbox
                    checked={isNeutered}
                    onCheckedChange={(checked: boolean) => handleSetData('isNeutered', checked)}
                    labelText="중성화 했어요"
                    className="duration-100 active:scale-[0.97] active:rounded-md active:bg-primary/40 active:px-1"
                />
            </div>
            <div className={`${birthCheck ? 'mt-4' : 'mt-8'}`}>
                <div className={`duration-100 ${birthCheck ? '' : 'relative mb-2 py-3'} `}>
                    {!birthCheck && (
                        <>
                            <input
                                type="date"
                                placeholder={`${name}의 생일이 궁금해요`}
                                className="w-full font-bold outline-none"
                                onChange={(event) => handleSetData('birth', event.target.value)}
                            />
                            <Divider className="absolute bottom-0 h-px" />
                        </>
                    )}
                </div>
                <Checkbox
                    checked={birthCheck}
                    onCheckedChange={(checked: boolean) => {
                        setBirthCheck(checked);
                        handleSetData('birth', null);
                    }}
                    labelText="생일을 몰라요"
                    className="duration-100 active:rounded-md active:bg-primary/40 active:px-1"
                />
            </div>
            <div className="mt-9">
                <div className={`relative py-3 ${weight && 'font-bold'}`}>
                    <input
                        value={weight}
                        type="number"
                        pattern="\d*"
                        inputMode="numeric"
                        placeholder={`${name}의 체중이 궁금해요`}
                        className={`outline-none ${weight ? 'w-9' : 'w-full'}`}
                        maxLength={3}
                        onInput={(e) => maxLengthCheck(e)}
                        onChange={(event) => {
                            setWeight(event.target.value);
                            handleSetData('weight', Number(event.target.value));
                        }}
                    />
                    {weight && 'kg'}
                    <Divider className="absolute bottom-0 h-px" />
                </div>
            </div>
        </div>
    );
}
