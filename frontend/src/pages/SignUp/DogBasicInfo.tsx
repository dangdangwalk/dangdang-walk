import SelectPhoto from '@/assets/icons/ic-select-photo.svg';
import { Divider } from '@/components/commons/Divider';
import React, { MutableRefObject } from 'react';
import { Dog } from '@/models/dog';
import { useStore } from '@/store';

type DogBasicInfoProps = Pick<Dog, 'name' | 'breed'>;
interface Props {
    data: DogBasicInfoProps;
    fileInputRef: MutableRefObject<null>;
    handleSetData: (key: string, value: string) => void;
    setIsOpen: (state: boolean) => void;
}

export default function DogBasicInfo({ data, fileInputRef, handleSetData, setIsOpen }: Props) {
    const dogProfileImgUrl = useStore((state) => state.dogProfileImgUrl);
    const onSelectFileChange = useStore((state) => state.onSelectFileChange);
    return (
        <>
            <div className="flex flex-col bg-white">
                <div>
                    <span className="text-xl font-semibold leading-[30px] text-amber-500">반려견의 기본 정보</span>
                    <span className="text-xl font-semibold leading-[30px] text-neutral-800">
                        를
                        <br />
                        알려주세요 :)
                    </span>
                </div>
                <div className="mb-6 mt-8 flex justify-center">
                    <label htmlFor="input-upload" ref={fileInputRef}>
                        <input
                            className="hidden"
                            name="input"
                            id="input-upload"
                            type="file"
                            accept="image/*"
                            onChange={onSelectFileChange}
                        />
                        <img
                            src={dogProfileImgUrl ? dogProfileImgUrl : SelectPhoto}
                            alt="selectphoto"
                            className="size-[7.5rem] rounded-full duration-100 active:scale-90"
                        />
                    </label>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="relative py-3">
                        <input
                            type="text"
                            placeholder="이름이 궁금해요"
                            className={`w-full font-['NanumGothic'] text-base font-bold leading-normal text-black outline-none placeholder:text-neutral-400`}
                            maxLength={10}
                            value={data.name}
                            onChange={(event) => handleSetData('name', event.target.value)}
                        />
                        <Divider className="absolute bottom-0 h-px" />
                    </div>
                    <div className="relative py-3">
                        <div
                            className={`${data.breed ? 'text-black' : 'text-neutral-400'} font-['NanumGothic'] text-base font-bold leading-normal`}
                            onClick={() => setIsOpen(true)}
                        >
                            {data.breed ? data.breed : '견종이 궁금해요'}
                        </div>
                        <Divider className="absolute bottom-0 h-px" />
                    </div>
                </div>
            </div>
        </>
    );
}
