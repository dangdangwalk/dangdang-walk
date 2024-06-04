import { Checkbox } from '@/components/common/Checkbox';
import { Divider } from '@/components/common/Divider';

interface AgreementsProps {
    service: boolean;
    location: boolean;
    personalInfo: boolean;
    marketing: boolean;
}
interface Props {
    toggle: boolean;
    allAgreed: boolean;
    handleAllCheck: (checked: boolean) => void;
    agreements: AgreementsProps;
    handleCheck: (checked: boolean, id: string) => void;
}

export default function AgreementsPage({ toggle, allAgreed, handleAllCheck, agreements, handleCheck }: Props) {
    return (
        <div className={`flex flex-col bg-white ${toggle && 'animate-mainToLeft'}`}>
            <span className="text-xl font-semibold leading-[30px] text-black">
                댕댕워크 사용을 위한
                <br />
                <span className="text-xl font-semibold leading-[30px] text-amber-500">약관내용에 동의</span>
                해주세요
            </span>

            <div className="mt-7 w-full">
                <Checkbox
                    checked={allAgreed}
                    onCheckedChange={(checked) => handleAllCheck(checked)}
                    labelText="모두 동의합니다"
                />
            </div>
            <Divider className="mt-4" />

            <div className="mt-6 inline-flex flex-col items-start justify-start gap-6">
                <div className="flex flex-col items-start justify-start gap-3">
                    <div className="text-xs font-normal leading-[18px] text-stone-500">필수 동의</div>
                    <div className="flex flex-col gap-1">
                        <Checkbox
                            checked={agreements.service}
                            onCheckedChange={(checked) => handleCheck(checked, 'service')}
                            labelText="서비스 이용약관"
                        />
                        <Checkbox
                            checked={agreements.location}
                            onCheckedChange={(checked) => handleCheck(checked, 'location')}
                            labelText="위치기반 서비스 이용약관"
                        />
                        <Checkbox
                            checked={agreements.personalInfo}
                            onCheckedChange={(checked) => handleCheck(checked, 'personalInfo')}
                            labelText="개인정보 수집과 이용"
                        />
                    </div>
                </div>

                <div className="inline-flex flex-col items-start justify-start gap-3">
                    <div className="text-xs font-normal leading-[18px] text-stone-500">선택 동의</div>
                    <div className="inline-flex flex-col items-start justify-start gap-[3.5px]">
                        <Checkbox
                            checked={agreements.marketing}
                            onCheckedChange={(checked) => handleCheck(checked, 'marketing')}
                            labelText="마케팅 정보 수신"
                        />
                        <div className="text-[10px] font-normal leading-[15px] text-stone-500">
                            앱 알림, 문자 메시지, 이메일로
                            <br /> 광고성 정보를 전송합니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
