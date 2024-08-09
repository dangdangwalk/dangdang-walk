import React, { useCallback, useEffect, useState } from 'react';
import { useGetProfile, useSignOut } from '@/hooks/useAuth';
import TopBar from '@/components/commons/Topbar';
import { useDog } from '@/hooks/useDog';
import Avatar from '@/components/commons/Avatar';
import SelectPhoto from '@/assets/icons/ic-select-photo.svg';
import { useNavigate } from 'react-router-dom';
import SettingIcon from '@/assets/icons/ic-setting.svg';
import LogoutIcon from '@/assets/buttons/btn-logout.svg';
import NoteIcon from '@/assets/icons/ic-note.svg';
import MegaphoneIcon from '@/assets/icons/ic-megaphone.svg';
import HeadphoneIcon from '@/assets/icons/ic-headphone.svg';
import RightArrowIcon from '@/assets/icons/ic-arrow-right.svg';
import CrownIcon from '@/assets/icons/ic-crown.svg';
import KaKao from '@/assets/icons/ic-provider-kakao.svg';
import Google from '@/assets/icons/ic-provider-google.svg';
import Naver from '@/assets/icons/ic-provider-naver.svg';
import { Divider } from '@/components/commons/Divider';
import DeactivateModal from '@/components/DeactivateModal';
import DogDetail from '@/pages/MyPage/DogDetail';
import { RecentMonthStatisticsResponse, fetchDogRecentMonthStatistics } from '@/api/dog';
import { Dog } from '@/models/dog';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store';

function MyPage() {
    const navigate = useNavigate();
    const { fetchDog } = useDog();
    const { data, isSuccess } = fetchDog;
    const [dogs, setDogs] = useState<Dog[]>([]);
    const isSignIn = useStore((state) => state.isSignedIn);
    const signOut = useSignOut();
    const { profileData } = useGetProfile({ enabled: isSignIn });
    const nickname = profileData?.nickname.substring(0, profileData?.nickname.indexOf('#'));
    const provider = profileData?.provider;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [deactivate, setDeactivate] = useState(false);
    const [statistics, setStatistics] = useState<RecentMonthStatisticsResponse>({
        totalWalkCnt: 0,
        totalDistance: 0,
        totalTime: 0,
    });
    const [dogInfo, setDogInfo] = useState<Dog>({
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
        (dog: Dog, data: RecentMonthStatisticsResponse) => {
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
            default:
                return Google;
        }
    };
    useEffect(() => {
        if (isSuccess) {
            setDogs(data ?? []);
        }
    }, [isSuccess, data]);
    return (
        <div className="flex w-fit bg-white">
            <div className="flex w-dvw flex-col sm:w-[640px]">
                <TopBar>
                    <TopBar.Front className="w-12" />
                    <TopBar.Center className="text-lg font-bold leading-[27px] text-black">마이페이지</TopBar.Center>
                    <TopBar.Back>
                        <img src={SettingIcon} alt="setting" />
                    </TopBar.Back>
                </TopBar>
                <main className={`flex h-[calc(100dvh-3rem-4rem)] flex-col overflow-y-auto`}>
                    <section className="flex items-center justify-between px-5 py-6">
                        <section className="flex justify-start gap-2">
                            <div className="text-lg font-bold leading-[33px] text-neutral-800">
                                {nickname ?? '견주'}님
                            </div>

                            <img src={ProviderIcon(provider)} alt="provider" />
                        </section>
                        <div onClick={() => signOut.mutate(null)} className="duration-100 active:scale-95">
                            <img src={LogoutIcon} alt="logout" />
                        </div>
                    </section>

                    <section className="mb-[2.125rem] mt-2.5 flex justify-between px-10">
                        <div
                            className="flex flex-col items-center p-2 duration-100 active:scale-95 active:rounded-md active:bg-primary/40"
                            onClick={() => dogs && dogs[0] && navigate(`/journals?dogId=${dogs[0].id}`)}
                        >
                            <img src={NoteIcon} alt="note" className="size-12" />
                            <p className="text-sm font-normal leading-[21px] text-neutral-800">산책기록</p>
                        </div>
                        <div
                            className="flex flex-col items-center p-2 duration-100 active:scale-95 active:rounded-md active:bg-primary/40"
                            onClick={() => {
                                window.ReactNativeWebView.postMessage(JSON.stringify({ data: 'hello!' }));
                            }}
                        >
                            <img src={MegaphoneIcon} alt="megaphone" className="size-12" />
                            <p className="text-sm font-normal leading-[21px] text-neutral-800">공지사항</p>
                        </div>
                        <div className="flex flex-col items-center p-2 duration-100 active:scale-95 active:rounded-md active:bg-primary/40">
                            <img src={HeadphoneIcon} alt="headphone" className="size-12" />
                            <p className="text-sm font-normal leading-[21px] text-neutral-800">문의하기</p>
                        </div>
                    </section>
                    <Divider />
                    <section>
                        <div className="p-5 text-base font-bold leading-normal text-neutral-800">나의 댕댕이</div>
                        {dogs &&
                            dogs.map((dog, index) => (
                                <div
                                    key={dog.id}
                                    className="flex items-center justify-between px-5 py-[6px] duration-100 active:scale-95 active:rounded-md active:bg-primary/40"
                                    onClick={async () => {
                                        const data = await fetchDogRecentMonthStatistics(dog.id);
                                        handleProfileOpen(dog, data);
                                    }}
                                >
                                    <div className="flex justify-start gap-2">
                                        <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                                        {index === 0 && <img src={CrownIcon} alt="crown" />}
                                    </div>
                                    <img src={RightArrowIcon} alt="rightArrow" />
                                </div>
                            ))}
                        {dogs && 5 - dogs?.length > 0 && (
                            <div
                                className="flex items-center justify-between px-5 py-[6px] duration-100 active:scale-95 active:rounded-md active:bg-primary/40"
                                onClick={() => navigate('/signup', { state: 'DogBasicInfo' })}
                            >
                                <Avatar url={SelectPhoto} name={'댕댕이 추가하기'} />
                            </div>
                        )}
                    </section>
                    <button
                        onClick={() => setDeactivate(true)}
                        className="mx-5 my-8 flex items-center justify-center rounded-lg border border-neutral-200 py-[13px] text-sm font-normal leading-[21px] text-neutral-400 duration-100 active:scale-[0.97]"
                    >
                        회원탈퇴
                    </button>
                </main>
                <Navbar />
            </div>
            <DogDetail
                dog={dogInfo}
                statistics={statistics}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
            />

            {deactivate && <DeactivateModal setDeactivate={setDeactivate} />}
        </div>
    );
}

export default MyPage;
