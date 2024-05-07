import CheckBox from '@/components/common/CheckBox';
import React, { ChangeEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Join() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    console.log(state);
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        service: false,
        location: false,
        personalInfo: false,
        marketing: false,
    });
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
    return (
        <div className="flex">
            <div id="agreement" className="bg-slate-200 w-full">
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
                <button>다음 단계로</button>
            </div>

            {/* <div className="bg-slate-500 ">
                <div>반려견여부 페이지</div>
                <div>반려견 기본정보를 알려주세요</div>
                <div>강아지 세부정보를 알려주세요</div>
            </div> */}
        </div>
    );
}
