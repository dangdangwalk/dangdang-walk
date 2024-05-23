import { ResponseDogs, ResponseRecentMonthStatistics } from '@/api/dogs';
import Topbar from '@/components/common/Topbar';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Back from '@/assets/icons/ic-top-back.svg';
import Edit from '@/assets/icons/ic-top-edit.svg';
import CrownIcon from '@/assets/icons/ic-crown.svg';
import Avatar from '@/components/common/Avatar';
import { Divider } from '@/components/common/Divider';
import DeleteDogModal from '@/components/DeleteDogModal';
import BreedSearch from '@/components/BreedSearch';
import { MaleIcon } from '@/components/icon/MaleIcon';
import FemaleIcon from '@/components/icon/FemaleIcon';
import { Checkbox } from '@/components/common/Checkbox2';
import EditPhoto from '@/assets/icons/btn-edit-photo.svg';
import { DogRegInfo } from '@/pages/Join';
import ImageCropper from '@/components/ImageCropper';
import { useCropStore } from '@/store/cropStore';
import { maxLengthCheck } from '@/pages/JoinStep/DogDetailInfo';
import { getUploadUrl } from '@/api/upload';
import { dataURLtoFile } from '@/utils/dataUrlToFile';
import { uploadImg, useDog } from '@/hooks/useDog';
import { secondsToTimeFormat } from '@/utils/time';
interface Props {
    dog: ResponseDogs;
    statistics: ResponseRecentMonthStatistics;
    isProfileOpen: boolean;
    setIsProfileOpen: (state: boolean) => void;
}
export default function DogProfile({ dog, statistics, isProfileOpen, setIsProfileOpen }: Props) {
    window.scrollTo({ top: 0 });
    const { updateDogMutation } = useDog();
    const { dogProfileImgUrl, setDogProfileImgUrl, onSelectFileChange } = useCropStore();

    const [onEdit, setOnEdit] = useState(false);
    window.location.pathname !== '/profile' && setOnEdit(false);
    const [breedSearchOpen, setBreedSearchOpen] = useState(false);
    const [deleteDogConfirm, setDeleteDogConfirm] = useState(false);
    const [registerData, setRegisterData] = useState<DogRegInfo>({
        name: '',
        breed: '',
        gender: 'MALE',
        isNeutered: false,
        birth: '',
        weight: 0,
        profilePhotoUrl: '',
    });

    const { totalDistance, totalTime, totalWalkCnt } = statistics;
    const { id, name, breed, birth, gender, isNeutered, weight, profilePhotoUrl } = dog;

    useEffect(() => {
        setRegisterData({
            name,
            breed,
            gender,
            isNeutered,
            birth,
            weight,
            profilePhotoUrl,
        });
    }, [dog]);

    const handleSave = async () => {
        const urlData = await getUploadUrl(['png']);
        const fileName = urlData[0]?.filename;
        const photoUrl = urlData[0]?.url;
        if (!fileName || !photoUrl) return;
        const file = dogProfileImgUrl && dataURLtoFile(dogProfileImgUrl, fileName);
        setDogProfileImgUrl('');

        file &&
            (await uploadImg(file, photoUrl).then(() => {
                updateDogMutation.mutate({ dogId: id, params: { ...registerData, profilePhotoUrl: fileName } });
            }));
        setOnEdit(false);
    };
    return (
        <>
            <div
                className={`w-dvw -right-full top-0 z-20 bg-white duration-200 ${isProfileOpen && '-translate-x-full'}`}
            >
                <Topbar>
                    <Topbar.Front
                        className="ml-3"
                        onClick={() => {
                            setIsProfileOpen(false);
                            setOnEdit(false);
                        }}
                    >
                        <img src={Back} alt="back" />
                    </Topbar.Front>
                    <Topbar.Center className="mr-3 font-bold">{name}</Topbar.Center>
                    <Topbar.Back
                        className={`${onEdit && 'w-12'}`}
                        onClick={() => {
                            setOnEdit(true);
                        }}
                    >
                        {!onEdit && <img src={Edit} alt="edit" />}
                    </Topbar.Back>
                </Topbar>
                {dog && (
                    <main className="flex flex-col mt-2 mb-[60px] ">
                        <section className=" flex flex-col items-center">
                            <img className="size-7" src={CrownIcon} alt="crown" />

                            <Avatar url={dogProfileImgUrl ? dogProfileImgUrl : profilePhotoUrl} size="large" />

                            {onEdit && (
                                <div className="absolute bottom-0 translate-x-12 -translate-y-1 flex justify-center items-center rounded-full size-[33px] bg-neutral-50/90">
                                    <label htmlFor="input-upload">
                                        <input
                                            className="hidden"
                                            name="input"
                                            id="input-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={onSelectFileChange}
                                        />
                                        <img src={EditPhoto} alt="editphoto" className="size-[22px] m-1" />
                                    </label>
                                </div>
                            )}
                        </section>

                        <section className="mt-9 px-5 pt-[10px] pb-5">
                            <div className="text-neutral-800 text-base font-bold">댕댕이 정보</div>
                            <section className="flex flex-col mt-6 gap-4">
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">이름</p>
                                    <input
                                        disabled={!onEdit}
                                        type="text"
                                        value={onEdit ? registerData.name : name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setRegisterData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="text-right text-neutral-800 text-sm font-bold bg-white outline-none"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">견종</p>
                                    <p
                                        className="text-neutral-800 text-sm font-bold"
                                        onClick={() => onEdit && setBreedSearchOpen(true)}
                                    >
                                        {registerData.breed ? registerData.breed : breed}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">성별</p>
                                    {onEdit ? (
                                        <div className="flex h-7 gap-2">
                                            <button
                                                onClick={() =>
                                                    setRegisterData((prev) => ({
                                                        ...prev,
                                                        gender: 'MALE',
                                                    }))
                                                }
                                                className={`border ${
                                                    registerData.gender === 'MALE'
                                                        ? 'border-primary'
                                                        : 'border-secondary'
                                                } bg-primary-foreground  rounded-lg w-full flex items-center justify-center px-[9px] py-[7px]`}
                                            >
                                                <div className="flex justify-center items-center gap-1">
                                                    <div
                                                        className={`text-base ${
                                                            registerData.gender === 'MALE'
                                                                ? 'text-neutral-800'
                                                                : 'text-stone-500'
                                                        }  font-bold`}
                                                    >
                                                        <MaleIcon
                                                            color={`${registerData.gender === 'MALE' ? '#222222' : '#999999'}`}
                                                            size="18"
                                                        />
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            registerData.gender === 'MALE'
                                                                ? 'text-neutral-800'
                                                                : 'text-neutral-400'
                                                        }  font-normal`}
                                                    >
                                                        남아
                                                    </div>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setRegisterData((prev) => ({
                                                        ...prev,
                                                        gender: 'FEMALE',
                                                    }))
                                                }
                                                className={`border ${
                                                    registerData.gender === 'FEMALE'
                                                        ? 'border-primary'
                                                        : 'border-secondary'
                                                } bg-primary-foreground  rounded-lg w-full flex items-center justify-center px-[9px] py-[7px]`}
                                            >
                                                <div className="flex justify-center items-center gap-1">
                                                    <div
                                                        className={`text-base ${
                                                            registerData.gender === 'FEMALE'
                                                                ? 'text-neutral-800'
                                                                : 'text-stone-500'
                                                        }  font-bold`}
                                                    >
                                                        <FemaleIcon
                                                            color={`${registerData.gender === 'FEMALE' ? '#222222' : '#999999'}`}
                                                            size="18"
                                                        />
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            registerData.gender === 'FEMALE'
                                                                ? 'text-neutral-800'
                                                                : 'text-neutral-400'
                                                        }  font-normal`}
                                                    >
                                                        여아
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-neutral-800 text-sm font-bold">
                                            {gender === 'MALE' ? '남아' : '여아'}
                                            {isNeutered && '(중성화)'}
                                        </p>
                                    )}
                                </div>
                                {onEdit && (
                                    <div className="flex justify-between">
                                        <p className="text-neutral-400 text-sm font-normal">중성화 유무</p>
                                        <Checkbox
                                            checked={onEdit ? registerData.isNeutered : isNeutered}
                                            onCheckedChange={(checked: boolean) =>
                                                setRegisterData((prev) => ({
                                                    ...prev,
                                                    isNeutered: checked,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">생일</p>
                                    {onEdit ? (
                                        registerData.birth && (
                                            <input
                                                type="date"
                                                value={registerData.birth}
                                                className="text-end"
                                                onChange={(event) =>
                                                    setRegisterData((prev) => ({
                                                        ...prev,
                                                        birth: event.target.value,
                                                    }))
                                                }
                                            />
                                        )
                                    ) : (
                                        <p className="text-neutral-800 text-sm font-bold">
                                            {birth ? birth : '생일을 몰라요'}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">체중</p>
                                    {onEdit ? (
                                        <div className="flex">
                                            <input
                                                className={`text-end bg-white outline-none`}
                                                type="number"
                                                pattern="\d*"
                                                inputMode="numeric"
                                                maxLength={3}
                                                value={onEdit ? registerData.weight : weight}
                                                onInput={(e) => maxLengthCheck(e)}
                                                onChange={(event) =>
                                                    setRegisterData((prev) => ({
                                                        ...prev,
                                                        weight: Number(event?.target.value),
                                                    }))
                                                }
                                            />
                                            <p>kg</p>
                                        </div>
                                    ) : (
                                        <p className="text-neutral-800 text-sm font-bold">{weight}kg</p>
                                    )}
                                </div>
                            </section>
                        </section>
                        <Divider />
                        <section className="px-5 pt-[30px]">
                            <div className="flex items-center gap-2">
                                <p className="text-neutral-800 text-base font-bold">최근산책</p>
                                <p className="text-neutral-400 text-xs font-normal">최근 한달간 산책기록이예요</p>
                            </div>
                            <section className="flex flex-col mt-6 gap-4">
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">총 횟수(회)</p>
                                    <p className="text-neutral-800 text-sm font-bold">{totalWalkCnt}회</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">총 거리(km)</p>
                                    <p className="text-neutral-800 text-sm font-bold">{totalDistance}km</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-neutral-400 text-sm font-normal">총 시간</p>
                                    <p className="text-neutral-800 text-sm font-bold">
                                        {secondsToTimeFormat(totalTime)}
                                    </p>
                                </div>
                            </section>
                        </section>

                        {onEdit && (
                            <button
                                onClick={handleSave}
                                className="flex justify-center items-center py-[13px] mx-5 mt-8 mb-2 rounded-lg text-white bg-primary text-sm font-bold leading-[21px]"
                            >
                                저장하기
                            </button>
                        )}
                        <button
                            onClick={() => setDeleteDogConfirm(true)}
                            className={`${!onEdit && 'mt-8'} flex justify-center items-center py-[13px] mx-5 mb-8 border border-neutral-200 rounded-lg text-neutral-400 text-sm font-normal leading-[21px]`}
                        >
                            댕댕이 삭제
                        </button>
                    </main>
                )}

                {deleteDogConfirm && <DeleteDogModal id={id} name={name} setDeleteDogConfirm={setDeleteDogConfirm} />}
            </div>
            <BreedSearch isOpen={breedSearchOpen} setIsOpen={setBreedSearchOpen} setData={setRegisterData} />
            <ImageCropper />
        </>
    );
}
