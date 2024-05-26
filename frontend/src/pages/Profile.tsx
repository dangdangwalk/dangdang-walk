import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Topbar from '@/components/common/Topbar';
import { useDog } from '@/hooks/useDog';
import Avatar from '@/components/common/Avatar';
import SelectPhoto from '@/assets/icons/ic-select-photo.svg';
import { useNavigate } from 'react-router-dom';
import SettingIcon from '@/assets/icons/ic-setting.svg';
import LogoutIcon from '@/assets/icons/btn-logout.svg';
import NoteIcon from '@/assets/icons/ic-note.svg';
import MegaphoneIcon from '@/assets/icons/ic-megaphone.svg';
import HeadphoneIcon from '@/assets/icons/ic-headphone.svg';
import RightArrowIcon from '@/assets/icons/ic-arrow.svg';
import CrownIcon from '@/assets/icons/ic-crown.svg';
import KaKao from '@/assets/icons/ic-provider-kakao.svg';
import Google from '@/assets/icons/ic-provider-google.svg';
import Naver from '@/assets/icons/ic-provider-naver.svg';
import { Divider } from '@/components/common/Divider';
import DeactivateModal from '@/components/DeactivateModal';
import DogProfile from '@/pages/DogProfile';
import { ResponseDogs, ResponseRecentMonthStatistics, fetchDogRecentMonthStatistics } from '@/api/dogs';
function Profile() {
    const navigate = useNavigate();
    const { useDogsQuery } = useDog();
    const { data, isSuccess } = useDogsQuery;
    const [dogs, setDogs] = useState<ResponseDogs[]>([
        {
            id: 0,
            birth: null,
            name: '',
            breed: '',
            gender: '',
            weight: 0,
            isNeutered: false,
            profilePhotoUrl: null,
        },
    ]);
    const { logoutMutation, profileData } = useAuth();
    const nickname = profileData?.nickname.substring(0, profileData?.nickname.indexOf('#'));
    const provider = profileData?.provider;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [deactivate, setDeactivate] = useState(false);
    const [statistics, setStatistics] = useState<ResponseRecentMonthStatistics>({
        totalWalkCnt: 0,
        totalDistance: 0,
        totalTime: 0,
    });
    const [dogInfo, setDogInfo] = useState<ResponseDogs>({
        id: 0,
        birth: null,
        name: '',
        breed: '',
        gender: '',
        weight: 0,
        isNeutered: false,
        profilePhotoUrl: null,
    });
    const handleProfileOpen = useCallback(
        (dog: ResponseDogs, data: ResponseRecentMonthStatistics) => {
            setDogInfo(dog);
            setStatistics(data);
            setIsProfileOpen(true);
        },
        [data, isSuccess]
    );
    const ProviderIcon = (provider: string) => {
        switch (provider) {
            case 'kakao':
                return KaKao;
            case 'google':
                return Google;
            case 'naver':
                return Naver;
        }
    };
    useEffect(() => {
        if (isSuccess) {
            setDogs(data);
        }
    }, [isSuccess, data]);
    return (
        <>
            <Topbar>
                <Topbar.Front className="w-12" />
                <Topbar.Center className="text-black text-lg font-bold leading-[27px]">마이페이지</Topbar.Center>
                <Topbar.Back>
                    <img src={SettingIcon} alt="setting" />
                </Topbar.Back>
            </Topbar>
            <main className={`flex flex-col mb-[60px] h-full`}>
                <section className="flex justify-between items-center px-5 py-6">
                    <section className="flex justify-start gap-2">
                        <div className="text-neutral-800 text-lg font-bold leading-[33px]">{nickname}님</div>

                        <img src={ProviderIcon(provider)} alt="provider" />
                    </section>
                    <div onClick={() => logoutMutation.mutate(null)}>
                        <img src={LogoutIcon} alt="logout" />
                    </div>
                </section>

                <section className="flex justify-between px-10 mt-[0.625rem] mb-[2.125rem]">
                    <div
                        className="flex flex-col items-center"
                        onClick={() => dogs && dogs[0] && navigate(`/journals?dogId=${dogs[0].id}`)}
                    >
                        <img src={NoteIcon} alt="note" className="size-12" />
                        <p className="text-neutral-800 text-sm font-normal leading-[21px]">산책기록</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={MegaphoneIcon} alt="megaphone" className="size-12" />
                        <p className="text-neutral-800 text-sm font-normal leading-[21px]">공지사항</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={HeadphoneIcon} alt="headphone" className="size-12" />
                        <p className="text-neutral-800 text-sm font-normal leading-[21px]">문의하기</p>
                    </div>
                </section>
                <Divider />
                <section>
                    <div className="px-5 py-5 text-neutral-800 text-base font-bold leading-normal">나의 댕댕이</div>
                    {dogs &&
                        dogs.map((dog, index) => (
                            <div key={dog.id} className="flex justify-between items-center px-5 py-[6px]">
                                <div className="flex justify-start gap-2">
                                    <Avatar url={`${dog.profilePhotoUrl}`} name={dog.name} />
                                    {index === 0 && <img src={CrownIcon} alt="crown" />}
                                </div>
                                <img
                                    src={RightArrowIcon}
                                    alt="rightArrow"
                                    onClick={async () => {
                                        const data = await fetchDogRecentMonthStatistics(dog.id);
                                        handleProfileOpen(dog, data);
                                    }}
                                />
                            </div>
                        ))}
                    {dogs && 5 - dogs?.length > 0 && (
                        <div
                            className="flex justify-between items-center px-5 py-[6px]"
                            onClick={() => navigate('/join', { state: 'DogBasicInfo' })}
                        >
                            <Avatar url={SelectPhoto} name={'댕댕이 추가하기'} />
                        </div>
                    )}
                </section>
                <button
                    onClick={() => setDeactivate(true)}
                    className="flex justify-center items-center py-[13px] mx-5 my-8 border border-neutral-200 rounded-lg text-neutral-400 text-sm font-normal leading-[21px]"
                >
                    회원탈퇴
                </button>
            </main>
            <DogProfile
                dog={dogInfo}
                statistics={statistics}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
            />
            {deactivate && <DeactivateModal setDeactivate={setDeactivate} />}
        </>
    );
}

export default Profile;
