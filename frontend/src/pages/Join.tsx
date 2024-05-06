import { useModalStateStore } from '@/store/modalStateStore';
import React, { useEffect } from 'react';

export default function Join() {
    const { setJoinningState } = useModalStateStore();

    useEffect(() => {
        window.addEventListener('popstate', () => setJoinningState(false));
    }, []);
    return (
        <div className="flex w-dvw">
            <div id="agreement" className="bg-slate-200 w-dvw">
                <div>
                    <button>뒤로가기버튼</button>
                </div>

                <div>
                    댕댕워크 사용을 위한
                    <br />
                    <span>약관내용에 동의</span>해주세요
                </div>

                <div>
                    <input type="checkbox" />
                    <span>모두 동의합니다</span>
                </div>

                <div>
                    <div>
                        <p>필수 동의</p>
                        <div>
                            <input type="checkbox" />
                            <span>서비스 이용약관</span>
                        </div>
                        <div>
                            <input type="checkbox" />
                            <span>위치기반 서비스 이용약관</span>
                        </div>
                        <div>
                            <input type="checkbox" />
                            <span>개인정보 수집과 이용</span>
                        </div>
                    </div>

                    <div>
                        <p>선택 동의</p>
                        <div>
                            <input type="checkbox" />
                            <span>마케팅 정보 수신</span>
                            <p>앱 알림, 문자 메시지, 이메일로 광고성 정보를 전송합니다.</p>
                        </div>
                    </div>
                </div>
                <button>다음 단계로</button>
            </div>

            <div className="bg-slate-500 ">
                <div>반려견여부 페이지</div>
                <div>반려견 기본정보를 알려주세요</div>
                <div>강아지 세부정보를 알려주세요</div>
            </div>
        </div>
    );
}
