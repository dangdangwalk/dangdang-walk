import Topbar from '@/components/common/Topbar';
import { getStorage, setStorage } from '@/utils/storage';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBack from '@/assets/icons/ic-top-back.svg';
import Agreements from '@/pages/JoinStep/Agreements';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import PetOwner from '@/pages/JoinStep/PetOwner';
import DogRegister1 from '@/pages/JoinStep/DogRegister1';
import Cancel from '@/assets/icons/ic-top-cancel.svg';
import DogRegister2 from '@/pages/JoinStep/DogRegister2';
export default function Join() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const backToPathname = getStorage('redirectURI') || '';
    const [haveADog, sethaveADog] = useState(true);
    const [gender, setGender] = useState('');
    const handleGenderChange = (gender: string) => {
        setGender(gender);
    };
    console.log(state);
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        service: false,
        location: false,
        personalInfo: false,
        marketing: false,
    });
    // const [regusterData, setRegisterData] = useState();
    const [step, setStep] = useState<'Agreements' | 'PetOwner' | 'Dog Registration1' | 'Dog Registration2'>(
        'Agreements'
    );
    const handleHaveADogChange = (opt: boolean) => {
        sethaveADog(opt);
    };
    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = event.target;
        setAgreements((prev) => ({
            ...prev,
            [id]: checked,
        }));
        const allChecked = Object.values({ ...agreements, [id]: checked }).every((value) => value === true);
        setAllAgreed(allChecked);
    };
    const handleAllCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
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
            //바로 로그인
            // const url = getAuthorizeCodeCallbackUrl(provider);
            // window.location.href = url;
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

        setTimeout(() => {
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
        }, 250);
    };
    const handleCancel = () => {
        //바로 로그인
        // const url = getAuthorizeCodeCallbackUrl(provider);
        // window.location.href = url;
    };
    const disabled = !agreements.service || !agreements.location || !agreements.personalInfo;
    useEffect(() => {
        setStorage('isJoinning', 'true');
    }, []);
    return (
        <div
            className={`flex flex-col bg-primary-foreground ${switchStep.mainToStep1 ? 'animate-mainToRight' : 'animate-outToMain'}`}
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
            <main className="w-full px-5 pt-6">
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
                {step === 'Dog Registration1' && <DogRegister1 />}
                {step === 'Dog Registration2' && (
                    <DogRegister2 gender={gender} handleGenderChange={handleGenderChange} />
                )}
            </main>
            <Button
                className="w-full absolute bottom-0"
                disabled={disabled}
                color="primary"
                rounded="none"
                onClick={handleNextStep}
            >
                다음 단계로
            </Button>
        </div>
    );
}
