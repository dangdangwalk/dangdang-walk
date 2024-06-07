import Topbar from '@/components/commons/Topbar';
import { getStorage } from '@/utils/storage';
import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBack from '@/assets/icons/ic-arrow-left.svg';
import Agreements from '@/pages/Join/Agreements';
import { Button } from '@/components/commons/Button';
import { Divider } from '@/components/commons/Divider';
import PetOwner from '@/pages/Join/PetOwner';
import Cancel from '@/assets/icons/ic-cancel.svg';
import { storageKeys } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import 'react-image-crop/dist/ReactCrop.css';
import CropperModal from '@/components/CropperModal';
import { uploadImg, useDog } from '@/hooks/useDog';
import { dataURLtoFile } from '@/utils/dataUrlToFile';
import { getUploadUrl } from '@/api/upload';
import CancelRegModal from '@/components/CancelRegModal';
import { useCropStore } from '@/store/cropStore';
import DogBasicInfo, { DogBasicInfoProps } from '@/pages/Join/DogBasicInfo';
import DogDetailInfo, { DogDetailInfoProps } from '@/pages/Join/DogDetailInfo';
import { useSpinnerStore } from '@/store/spinnerStore';

export interface DogRegInfo extends DogBasicInfoProps, DogDetailInfoProps {
    profilePhotoUrl?: string | null;
}

export default function Join() {
    const navigate = useNavigate();
    const provider = getStorage(storageKeys.PROVIDER);
    if (!provider) navigate('/');
    const location = useLocation();
    const currentPage = location.state;
    const { signUp } = useAuth();
    const { registerDogMutation } = useDog();
    const { spinnerAdd, spinnerRemove } = useSpinnerStore();
    const { cropError, dogProfileImgUrl, setDogProfileImgUrl } = useCropStore();
    const backToPathname = getStorage(storageKeys.REDIRECT_URI) || '';

    const fileInputRef = useRef(null);
    const [cancelReg, setCancelReg] = useState(false);
    const [haveADog, sethaveADog] = useState(true);
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        service: false,
        location: false,
        personalInfo: false,
        marketing: false,
    });
    const [registerData, setRegisterData] = useState<DogRegInfo>({
        name: '',
        breed: '',
        gender: '',
        isNeutered: false,
        birth: null,
        weight: 0,
        profilePhotoUrl: null,
    });
    const [step, setStep] = useState<'Agreements' | 'PetOwner' | 'DogBasicInfo' | 'DogDetailInfo'>(
        currentPage ?? 'Agreements'
    );

    const handleCheck = (checked: boolean, id: string) => {
        setAgreements((prev) => ({
            ...prev,
            [id]: checked,
        }));
        const allChecked = Object.values({ ...agreements, [id]: checked }).every((value) => value === true);
        setAllAgreed(allChecked);
    };
    const handleAllCheck = (checked: boolean) => {
        setAgreements((prevAgreements) => ({
            ...prevAgreements,
            service: checked,
            location: checked,
            personalInfo: checked,
            marketing: checked,
        }));
        setAllAgreed(checked);
    };

    const [switchStep, setSwitchStep] = useState({
        mainToStep1: false,
        step1ToStep2: false,
        step2ToStep3: false,
        step3ToStep4: false,
    });
    const handleGoBack = () => {
        switch (step) {
            case 'Agreements':
                setSwitchStep({ ...switchStep, mainToStep1: true });
                break;
            case 'PetOwner':
                setSwitchStep({ ...switchStep, step1ToStep2: false });
                break;
            case 'DogBasicInfo':
                currentPage ? navigate(-1) : setSwitchStep({ ...switchStep, step2ToStep3: false });
                break;
            case 'DogDetailInfo':
                setSwitchStep({ ...switchStep, step3ToStep4: false });
                break;
        }

        setTimeout(() => {
            switch (step) {
                case 'Agreements':
                    navigate(backToPathname);
                    break;
                case 'PetOwner':
                    setStep('Agreements');
                    break;
                case 'DogBasicInfo':
                    setStep('PetOwner');
                    break;
                case 'DogDetailInfo':
                    setStep('DogBasicInfo');
                    break;
            }
        }, 250);
    };

    const handleNextStep = async () => {
        if (step === 'PetOwner') {
            signUp.mutate(null, {
                onSettled: () => {
                    !haveADog && navigate('/');
                },
            });
        }
        if (step === 'DogDetailInfo') {
            spinnerAdd();
            const urlData = await getUploadUrl(['png']);
            const fileName = urlData[0]?.filename;
            const photoUrl = urlData[0]?.url;

            if (!fileName || !photoUrl) return;
            const file = dogProfileImgUrl && dataURLtoFile(dogProfileImgUrl, fileName);
            setDogProfileImgUrl('');
            file === ''
                ? registerDogMutation.mutate({ ...registerData, profilePhotoUrl: null })
                : await uploadImg(file, photoUrl).then(() => {
                      registerDogMutation.mutate({ ...registerData, profilePhotoUrl: fileName });
                  });
            spinnerRemove();
        }

        switch (step) {
            case 'Agreements':
                setStep('PetOwner');
                break;
            case 'PetOwner':
                setStep('DogBasicInfo');
                break;
            case 'DogBasicInfo':
                setStep('DogDetailInfo');
                break;
        }
    };

    const disabled = () => {
        switch (step) {
            case 'Agreements':
                return !agreements.service || !agreements.location || !agreements.personalInfo;
            case 'DogBasicInfo':
                return !registerData.name || !registerData.breed;
            case 'DogDetailInfo':
                return !registerData.gender || !registerData.weight;
        }
    };

    const ButtonText = () => {
        const buttonText = useMemo(() => {
            switch (step) {
                case 'Agreements':
                    return '다음 단계로';
                case 'PetOwner':
                    return haveADog ? '다음 단계로' : '가입 완료';
                case 'DogBasicInfo':
                    return '다음 단계로';
                case 'DogDetailInfo':
                    return currentPage ? '등록 완료' : '가입 완료';
            }
        }, [step, haveADog]);

        return buttonText;
    };

    return (
        <div
            className={`relative flex h-dvh w-full flex-col bg-primary-foreground ${switchStep.mainToStep1 ? 'animate-mainToRight' : 'animate-outToMain'}`}
        >
            <Topbar>
                <Topbar.Front className="pl-3">
                    <img src={TopBack} alt="ToBack" onClick={handleGoBack} />
                </Topbar.Front>
                {step !== 'Agreements' && (
                    <Topbar.Back>
                        <img src={Cancel} alt="cancel" onClick={() => setCancelReg(true)} />
                    </Topbar.Back>
                )}
            </Topbar>
            <Divider
                className={`w-0 bg-primary duration-500 ease-in-out ${step === 'PetOwner' && 'w-1/3'} ${step === 'DogBasicInfo' && (currentPage ? 'w-1/2' : 'w-2/3')} ${step === 'DogDetailInfo' && 'w-full'}`}
            />

            <main className="h-full w-full px-5 pt-6">
                {step === 'Agreements' && (
                    <Agreements
                        toggle={switchStep.step1ToStep2}
                        allAgreed={allAgreed}
                        handleAllCheck={handleAllCheck}
                        agreements={agreements}
                        handleCheck={handleCheck}
                    />
                )}
                {step === 'PetOwner' && (
                    <PetOwner haveADog={haveADog} handleHaveADogChange={(opt: boolean) => sethaveADog(opt)} />
                )}
                {step === 'DogBasicInfo' && (
                    <DogBasicInfo fileInputRef={fileInputRef} data={registerData} setData={setRegisterData} />
                )}
                {step === 'DogDetailInfo' && <DogDetailInfo data={registerData} setData={setRegisterData} />}
            </main>
            <div className="absolute bottom-0 w-full">
                <Button
                    className="w-full"
                    disabled={disabled()}
                    color="primary"
                    rounded="none"
                    onClick={handleNextStep}
                >
                    {ButtonText()}
                </Button>
            </div>
            {cropError && <CropperModal fileInputRef={fileInputRef} />}
            {cancelReg && <CancelRegModal setCancelReg={setCancelReg} />}
        </div>
    );
}
