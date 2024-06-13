import { RecentMonthStatisticsResponse } from '@/api/dog';
import { getUploadUrl } from '@/api/upload';
import EditPhoto from '@/assets/buttons/btn-edit-photo.svg';
import CrownIcon from '@/assets/icons/ic-crown.svg';
import Back from '@/assets/icons/ic-arrow-left.svg';
import Edit from '@/assets/icons/ic-edit.svg';
import BreedSearch from '@/components/BreedSearch';
import DeleteDogModal from '@/components/DeleteDogModal';
import ImageCropper from '@/components/ImageCropper';
import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import TopBar from '@/components/commons/Topbar';
import FemaleIcon from '@/components/icons/FemaleIcon';
import { MaleIcon } from '@/components/icons/MaleIcon';
import { uploadImg, useDog } from '@/hooks/useDog';
import { useCropStore } from '@/store/cropStore';
import { dataURLtoFile } from '@/utils/dataUrlToFile';
import { secondsToTimeFormat } from '@/utils/time';
import { ChangeEvent, useEffect, useState } from 'react';
import { Dog, DogCreateForm } from '@/models/dog';
import useToast from '@/hooks/useToast';
import { maxLengthCheck } from '@/pages/Join/DogDetailInfo';
import { valueWithUnit } from '@/utils/distance';
import { useSpinnerStore } from '@/store/spinnerStore';
interface Props {
    dog: Dog;
    statistics: RecentMonthStatisticsResponse;
    isProfileOpen: boolean;
    setIsProfileOpen: (state: boolean) => void;
}
export default function DogDetail({ dog, statistics, isProfileOpen, setIsProfileOpen }: Props) {
    const { updateDog } = useDog();
    const { show } = useToast();
    const { spinnerAdd, spinnerRemove } = useSpinnerStore();
    const { dogProfileImgUrl, setDogProfileImgUrl, onSelectFileChange } = useCropStore();
    const [onEdit, setOnEdit] = useState(false);
    window.location.pathname !== '/mypage' && setOnEdit(false);
    const [breedSearchOpen, setBreedSearchOpen] = useState(false);
    const [deleteDogConfirm, setDeleteDogConfirm] = useState(false);
    const [registerData, setRegisterData] = useState<DogCreateForm>(dog);

    const { totalDistance, totalTime, totalWalkCnt } = statistics;
    const { id } = dog;
    const { name, breed, birth, gender, isNeutered, weight, profilePhotoUrl } = registerData;
    useEffect(() => {
        setDogProfileImgUrl('');
        setRegisterData(dog);
    }, [dog]);
    const handleSetData = (key: string, value: string | boolean | null | number) => {
        setRegisterData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const handleSave = async () => {
        spinnerAdd();
        if (dogProfileImgUrl) {
            const urlData = await getUploadUrl(['jpeg']);
            const fileName = urlData[0]?.filename;
            const photoUrl = urlData[0]?.url;

            if (!fileName || !photoUrl) return;

            const file = dataURLtoFile(dogProfileImgUrl, fileName);

            setDogProfileImgUrl('');

            await uploadImg(file, photoUrl);

            updateDog.mutate({
                dogId: id,
                params: { ...registerData, profilePhotoUrl: fileName },
            });
            setRegisterData({ ...registerData, profilePhotoUrl: fileName });
        } else {
            setDogProfileImgUrl('');

            updateDog.mutate({
                dogId: id,
                params: { name, breed, birth, gender, isNeutered, weight },
            });
        }
        spinnerRemove();
        setOnEdit(false);
        show('댕댕이 기록이 변경되었습니다');
    };
    return (
        <>
            <div
                className={`fixed -right-full top-0 z-20 max-h-dvh w-full overflow-y-scroll bg-white duration-200 ${isProfileOpen && '-translate-x-full'}`}
            >
                <TopBar>
                    <TopBar.Front
                        className="ml-3"
                        onClick={() => {
                            setIsProfileOpen(false);
                            setOnEdit(false);
                        }}
                    >
                        <img src={Back} alt="back" />
                    </TopBar.Front>
                    <TopBar.Center className="mr-3 font-bold">{name}</TopBar.Center>
                    <TopBar.Back
                        className={`${onEdit && 'w-12'}`}
                        onClick={() => {
                            setOnEdit(true);
                        }}
                    >
                        {!onEdit && <img src={Edit} alt="edit" />}
                    </TopBar.Back>
                </TopBar>
                {dog && (
                    <main className="mb-[60px] mt-2 flex flex-col">
                        <section className="relative flex flex-col items-center">
                            <img className="size-7" src={CrownIcon} alt="crown" />

                            <Avatar url={dogProfileImgUrl ? dogProfileImgUrl : profilePhotoUrl} size="large" />

                            {onEdit && (
                                <div className="absolute bottom-0 flex size-[33px] -translate-y-1 translate-x-12 items-center justify-center rounded-full bg-neutral-50/90">
                                    <label htmlFor="input-upload">
                                        <input
                                            className="hidden"
                                            name="input"
                                            id="input-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={onSelectFileChange}
                                        />
                                        <img
                                            src={EditPhoto}
                                            alt="editphoto"
                                            className="m-1 size-[22px] duration-100 hover:scale-90"
                                        />
                                    </label>
                                </div>
                            )}
                        </section>

                        <section className="mt-9 px-5 pb-5 pt-[10px]">
                            <div className="text-base font-bold text-neutral-800">댕댕이 정보</div>
                            <section className="mt-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-normal text-neutral-400">이름</p>
                                    <input
                                        disabled={!onEdit}
                                        type="text"
                                        value={name}
                                        size={registerData.name.length === 0 ? 1 : registerData.name.length * 2}
                                        maxLength={10}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setRegisterData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className={`text-sm font-bold text-neutral-800 outline-none ${onEdit ? 'rounded-md bg-primary/40 p-2 text-center duration-100 active:scale-90' : 'bg-transparent text-right'}`}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-normal text-neutral-400">견종</p>
                                    <p
                                        className={`text-sm font-bold text-neutral-800 duration-100 ${onEdit && 'rounded-md bg-primary/40 p-2 active:scale-90'}`}
                                        onClick={() => onEdit && setBreedSearchOpen(true)}
                                    >
                                        {breed}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-normal text-neutral-400">성별</p>
                                    {onEdit ? (
                                        <div className="flex h-7 gap-2">
                                            <button
                                                onClick={() =>
                                                    setRegisterData((prev) => ({
                                                        ...prev,
                                                        gender: 'MALE',
                                                    }))
                                                }
                                                className={`border duration-100 active:scale-95 ${
                                                    gender === 'MALE' ? 'border-primary' : 'border-secondary'
                                                } flex w-full items-center justify-center rounded-lg bg-primary-foreground px-[9px] py-[7px]`}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    <div
                                                        className={`text-base ${
                                                            gender === 'MALE' ? 'text-neutral-800' : 'text-stone-500'
                                                        } font-bold`}
                                                    >
                                                        <MaleIcon
                                                            color={`${gender === 'MALE' ? '#222222' : '#999999'}`}
                                                            size="18"
                                                        />
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
                                                onClick={() =>
                                                    setRegisterData((prev) => ({
                                                        ...prev,
                                                        gender: 'FEMALE',
                                                    }))
                                                }
                                                className={`border duration-100 active:scale-95 ${
                                                    gender === 'FEMALE' ? 'border-primary' : 'border-secondary'
                                                } flex w-full items-center justify-center rounded-lg bg-primary-foreground px-[9px] py-[7px]`}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    <div
                                                        className={`text-base ${
                                                            gender === 'FEMALE' ? 'text-neutral-800' : 'text-stone-500'
                                                        } font-bold`}
                                                    >
                                                        <FemaleIcon
                                                            color={`${gender === 'FEMALE' ? '#222222' : '#999999'}`}
                                                            size="18"
                                                        />
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            gender === 'FEMALE'
                                                                ? 'text-neutral-800'
                                                                : 'text-neutral-400'
                                                        } font-normal`}
                                                    >
                                                        여아
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-bold text-neutral-800">
                                            {gender === 'MALE' ? '남아' : '여아'}
                                            {isNeutered && '(중성화)'}
                                        </p>
                                    )}
                                </div>
                                {onEdit && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-normal text-neutral-400">중성화 유무</p>
                                        <Checkbox
                                            className="duration-100 active:scale-90"
                                            checked={isNeutered}
                                            onCheckedChange={(checked: boolean) =>
                                                setRegisterData((prev) => ({
                                                    ...prev,
                                                    isNeutered: checked,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-normal text-neutral-400">생일</p>
                                    {onEdit ? (
                                        <input
                                            type="date"
                                            value={birth ? birth : ''}
                                            className="text-end"
                                            onChange={(event) =>
                                                setRegisterData((prev) => ({
                                                    ...prev,
                                                    birth: event.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-neutral-800">
                                            {birth ? birth : '생일을 몰라요'}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-normal text-neutral-400">체중</p>
                                    {onEdit ? (
                                        <div
                                            className={`flex items-center ${onEdit && 'rounded-md bg-primary/40 p-2 duration-100 active:scale-90'}`}
                                        >
                                            <input
                                                className={`w-7 text-end outline-none ${onEdit && 'bg-transparent'}`}
                                                type="number"
                                                pattern="\d*"
                                                inputMode="numeric"
                                                maxLength={3}
                                                size={4}
                                                value={weight}
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
                                        <p className="text-sm font-bold text-neutral-800">{weight}kg</p>
                                    )}
                                </div>
                            </section>
                        </section>
                        <Divider />
                        <section className="px-5 pt-[30px]">
                            <div className="flex items-center gap-2">
                                <p className="text-base font-bold text-neutral-800">최근산책</p>
                                <p className="text-xs font-normal text-neutral-400">최근 한달간 산책기록이예요</p>
                            </div>
                            <section className="mt-6 flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal text-neutral-400">총 횟수(회)</p>
                                    <p className="text-sm font-bold text-neutral-800">{totalWalkCnt}회</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal text-neutral-400">총 거리</p>
                                    <p className="text-sm font-bold text-neutral-800">{valueWithUnit(totalDistance)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal text-neutral-400">총 시간</p>
                                    <p className="text-sm font-bold text-neutral-800">
                                        {secondsToTimeFormat(totalTime)}
                                    </p>
                                </div>
                            </section>
                        </section>

                        {onEdit && (
                            <button
                                onClick={handleSave}
                                className="mx-5 mb-2 mt-8 flex items-center justify-center rounded-lg bg-primary py-[13px] text-sm font-bold leading-[21px] text-white duration-100 active:scale-[0.97]"
                            >
                                저장하기
                            </button>
                        )}
                        <button
                            onClick={() => setDeleteDogConfirm(true)}
                            className={`${!onEdit && 'mt-8'} mx-5 mb-8 flex items-center justify-center rounded-lg border border-neutral-200 py-[13px] text-sm font-normal leading-[21px] text-neutral-400 duration-100 active:scale-[0.97]`}
                        >
                            댕댕이 삭제
                        </button>
                    </main>
                )}

                {deleteDogConfirm && <DeleteDogModal id={id} name={name} setDeleteDogConfirm={setDeleteDogConfirm} />}
            </div>
            <BreedSearch isOpen={breedSearchOpen} setIsOpen={setBreedSearchOpen} handleSetData={handleSetData} />
            <ImageCropper />
        </>
    );
}
