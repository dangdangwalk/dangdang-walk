import { Button } from '@/components/common/Button';
import CheckBox from '@/components/common/CheckBox';
import { getAuthorizeCodeCallbackUrl } from '@/utils/oauth';
import { getStorage, setStorage } from '@/utils/storage';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Join() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [option, setOption] = useState('opt1');
    console.log(state);
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        service: false,
        location: false,
        personalInfo: false,
        marketing: false,
    });
    const handleOptionChange = (opt: string) => {
        setOption(opt);
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
    const backButtonHandler = () => {
        navigate(-1);
    };
    const handleNextStep = () => {
        // option ==='opt1' ? '다음페이지' : '바로 가입시켜'
        const provider = getStorage('provider') || '';
        const url = getAuthorizeCodeCallbackUrl(provider);
        window.location.href = url;
    };
    const disabled = !agreements.service || !agreements.location || !agreements.personalInfo;
    useEffect(() => {
        setStorage('isJoinning', 'true');
    }, []);
    return (
        <div className="flex flex-col bg-primary-foreground">
            <div id="agreement" className=" w-full">
                <div>
                    <button onClick={backButtonHandler}>뒤로가기버튼</button>
                </div>

                <div>
                    댕댕워크 사용을 위한
                    <br />
                    <span>약관내용에 동의</span>해주세요
                </div>

                <div>
                    <CheckBox id={'all'} checked={allAgreed} onChange={handleAllCheck} content={'모두 동의합니다.'} />
                </div>

                <div>
                    <div>
                        <p>필수 동의</p>
                        <div>
                            <CheckBox
                                id={'service'}
                                checked={agreements.service}
                                onChange={handleCheck}
                                content={'서비스 이용약관'}
                            />
                        </div>
                        <div>
                            <CheckBox
                                id={'location'}
                                checked={agreements.location}
                                onChange={handleCheck}
                                content={'위치기반 서비스 이용약관'}
                            />
                        </div>
                        <div>
                            <CheckBox
                                id={'personalInfo'}
                                checked={agreements.personalInfo}
                                onChange={handleCheck}
                                content={'개인정보 수집과 이용'}
                            />
                        </div>
                    </div>

                    <div>
                        <p>선택 동의</p>
                        <div>
                            <CheckBox
                                id={'marketing'}
                                checked={agreements.marketing}
                                onChange={handleCheck}
                                content={'마케팅 정보 수신'}
                            />
                            <p>앱 알림, 문자 메시지, 이메일로 광고성 정보를 전송합니다.</p>
                        </div>
                    </div>
                </div>
                <Button className="w-full" disabled={disabled} color="primary" rounded="none" onClick={handleNextStep}>
                    다음 단계로
                </Button>
                <button></button>
            </div>

            <div className="flex flex-col justify-center mx-auto w-full">
                <div>topBar</div>
                <div>procressBar</div>
                <div className="mx-5">
                    <div className="">해당되는 항목을 선택해주세요!</div>
                    <div className="flex flex-col gap-3 mx-[0.625rem] mb-4">
                        <button
                            onClick={() => handleOptionChange('opt1')}
                            className={`border ${
                                option === 'opt1' ? 'border-primary' : 'border-secondary'
                            } bg-primary-foreground  rounded-lg w-full flex flex-col items-center justify-center`}
                        >
                            <div className="my-6">
                                <div
                                    className={`text-base ${
                                        option === 'opt1' ? 'text-neutral-800' : 'text-stone-500'
                                    }  font-bold`}
                                >
                                    반려견을 키우고 있어요
                                </div>
                                <div
                                    className={`text-xs ${
                                        option === 'opt1' ? 'text-neutral-800' : 'text-neutral-400'
                                    }  font-normal`}
                                >
                                    나의 반려견 정보 입력하기
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleOptionChange('opt2')}
                            className={`border ${
                                option === 'opt2' ? 'border-primary' : 'border-secondary'
                            } bg-primary-foreground  rounded-lg w-full flex flex-col items-center justify-center`}
                        >
                            <div className="my-6">
                                <div
                                    className={`text-base ${
                                        option === 'opt2' ? 'text-neutral-800' : 'text-stone-500'
                                    }  font-bold`}
                                >
                                    반려견을 키우고 있지 않아요
                                </div>
                                <div
                                    className={`text-xs ${
                                        option === 'opt2' ? 'text-neutral-800' : 'text-neutral-400'
                                    }  font-normal`}
                                >
                                    반려견 등록 없이 간편가입
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                <Button className="w-full" color="primary" rounded="none" onClick={handleNextStep}>
                    다음 단계로
                </Button>
            </div>
        </div>
    );
}
