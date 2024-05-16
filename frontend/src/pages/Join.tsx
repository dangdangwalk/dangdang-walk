import Topbar from '@/components/common/Topbar';
import { getStorage } from '@/utils/storage';
import React, { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBack from '@/assets/icons/ic-top-back.svg';
import Agreements from '@/pages/JoinStep/Agreements';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import PetOwner from '@/pages/JoinStep/PetOwner';
import DogRegister1, { DogBasicInfo } from '@/pages/JoinStep/DogRegister1';
import Cancel from '@/assets/icons/ic-top-cancel.svg';
import DogRegister2, { DogDetailInfo } from '@/pages/JoinStep/DogRegister2';
import { storageKeys } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from '@/components/ImageCropper';
import CropperModal from '@/components/CropperModal';
import { PercentCrop } from 'react-image-crop';
import { MIN_DIMENSION } from '@/constants/cropper';
export interface DogRegInfo {
    dogBasicInfo: DogBasicInfo;
    dogDetailInfo: DogDetailInfo;
}

export default function Join() {
    const { signupMustation } = useAuth();
    const navigate = useNavigate();
    const backToPathname = getStorage(storageKeys.REDIRECT_URI) || '';
    const [haveADog, sethaveADog] = useState(true);

    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        service: false,
        location: false,
        personalInfo: false,
        marketing: false,
    });
    const [registerData, setRegisterData] = useState<DogRegInfo>({
        dogBasicInfo: {
            profilePhotoUrl: '',
            name: '',
            breed: '',
        },
        dogDetailInfo: {
            gender: '',
            isNeutered: false,
            birth: '',
            notSureBday: false,
            weight: 0,
        },
    });
    const [step, setStep] = useState<'Agreements' | 'PetOwner' | 'Dog Registration1' | 'Dog Registration2'>(
        'Agreements'
    );
    const handleHaveADogChange = (opt: boolean) => {
        sethaveADog(opt);
    };
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
    const handleGoBack = () => {
        switch (step) {
            case 'Agreements':
                setSwitchStep({ ...switchStep, mainToStep1: true });
                break;
            case 'PetOwner':
                setSwitchStep({ ...switchStep, step1ToStep2: false });
                break;
            case 'Dog Registration1':
                setSwitchStep({ ...switchStep, step2ToStep3: false });
                break;
            case 'Dog Registration2':
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
                case 'Dog Registration1':
                    setStep('PetOwner');
                    break;
                case 'Dog Registration2':
                    setStep('Dog Registration1');
                    break;
            }
        }, 250);
    };
    const [switchStep, setSwitchStep] = useState({
        mainToStep1: false,
        step1ToStep2: false,
        step2ToStep3: false,
        step3ToStep4: false,
    });
    const handleNextStep = () => {
        if (step === 'PetOwner' && !haveADog) {
            return signupMustation.mutate(null);
        }
        switch (step) {
            case 'Agreements':
                setSwitchStep({ ...switchStep, step1ToStep2: true });
                break;
            case 'PetOwner':
                setSwitchStep({ ...switchStep, step2ToStep3: true });
                break;
            case 'Dog Registration1':
                setSwitchStep({ ...switchStep, step3ToStep4: true });
                break;
        }

        switch (step) {
            case 'Agreements':
                setStep('PetOwner');
                break;
            case 'PetOwner':
                setStep('Dog Registration1');
                break;
            case 'Dog Registration1':
                setStep('Dog Registration2');
                break;
        }
    };
    const handleCancel = () => {
        return signupMustation.mutate(null);
    };

    const disabled = () => {
        switch (step) {
            case 'Agreements':
                return !agreements.service || !agreements.location || !agreements.personalInfo;
            case 'Dog Registration1':
                return !registerData.dogBasicInfo.name || !registerData.dogBasicInfo.breed;
            case 'Dog Registration2':
                return (
                    !registerData.dogDetailInfo.gender ||
                    !registerData.dogDetailInfo.birth ||
                    !registerData.dogDetailInfo.weight
                );
        }
    };

    const ButtonText = () => {
        const buttonText = useMemo(() => {
            switch (step) {
                case 'Agreements':
                    return '다음 단계로';
                case 'PetOwner':
                    return haveADog ? '다음 단계로' : '가입 완료';
                case 'Dog Registration1':
                    return '다음 단계로';
                case 'Dog Registration2':
                    return '가입 완료';
            }
        }, [step, haveADog]);

        return buttonText;
    };

    const [cropperToggle, setCropperToggle] = useState(false);
    const [cropError, setCropError] = useState(false);
    const [prevImg, setPrevImg] = useState('');
    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        setPrevImg('');
        const files = e.target.files?.[0];

        if (!files) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || '';
            imageElement.src = imageUrl;

            imageElement.addEventListener('load', (e) => {
                if (cropError) setCropError(false);
                const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;
                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setCropError(true);
                    setCropperToggle(false);
                    setCrop(undefined);
                    return;
                } else {
                    setPrevImg(imageUrl);
                    setCropperToggle(true);
                }
            });
        });

        reader.readAsDataURL(files);
        e.currentTarget.value = '';
    };
    const [crop, setCrop] = useState<PercentCrop>();
    const fileInputRef = useRef(null);
    return (
        <div
            className={`relative flex flex-col w-full h-dvh bg-primary-foreground ${switchStep.mainToStep1 ? 'animate-mainToRight' : 'animate-outToMain'}`}
        >
            <Topbar>
                <Topbar.Front className="pl-3">
                    <img src={TopBack} alt="ToBack" onClick={handleGoBack} />
                </Topbar.Front>
                {step !== 'Agreements' && (
                    <Topbar.Back>
                        <img src={Cancel} alt="cancel" onClick={handleCancel} />
                    </Topbar.Back>
                )}
            </Topbar>
            <Divider
                className={`bg-primary duration-500 w-0 ease-in-out ${step === 'PetOwner' && 'w-1/3'} ${step === 'Dog Registration1' && 'w-2/3'} ${step === 'Dog Registration2' && 'w-full'}`}
            />

            <main className="w-full h-full px-5 pt-6">
                {step === 'Agreements' && (
                    <Agreements
                        toggle={switchStep.step1ToStep2}
                        allAgreed={allAgreed}
                        handleAllCheck={handleAllCheck}
                        agreements={agreements}
                        handleCheck={handleCheck}
                    />
                )}
                {step === 'PetOwner' && <PetOwner haveADog={haveADog} handleHaveADogChange={handleHaveADogChange} />}
                {step === 'Dog Registration1' && (
                    <DogRegister1
                        fileInputRef={fileInputRef}
                        data={registerData?.dogBasicInfo}
                        setData={setRegisterData}
                        setCropperToggle={setCropperToggle}
                        onSelectFile={onSelectFile}
                    />
                )}
                {step === 'Dog Registration2' && <DogRegister2 data={registerData} setData={setRegisterData} />}
            </main>
            <div className="absolute bottom-0 w-full">
                <Button
                    className="w-full "
                    disabled={disabled()}
                    color="primary"
                    rounded="none"
                    onClick={handleNextStep}
                >
                    {ButtonText()}
                </Button>
            </div>
            <ImageCropper
                prevImg={prevImg}
                setPrevImg={setPrevImg}
                crop={crop}
                setCrop={setCrop}
                cropperToggle={cropperToggle}
                setCropperToggle={setCropperToggle}
                setRegisterData={setRegisterData}
                onSelectFile={onSelectFile}
            />
            {cropError && <CropperModal setCropError={setCropError} setCrop={setCrop} fileInputRef={fileInputRef} />}
        </div>
    );
}
