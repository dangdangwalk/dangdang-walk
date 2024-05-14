import Cancel from '@/assets/icons/ic-top-cancel.svg';
import Avatar from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import Topbar from '@/components/common/Topbar';
import WalkInfo from '@/components/walk/WalkInfo';

export default function CreateForm() {
    return (
        <>
            <div className="flex flex-col">
                <Topbar>
                    <Topbar.Center className="text-center text-lg font-bold leading-[27px]">
                        <h1>5월 2일 산책기록</h1>
                    </Topbar.Center>
                    <Topbar.Back className="w-12 flex items-center">
                        <img src={Cancel} alt="cancel" />
                    </Topbar.Back>
                </Topbar>
                <div className={`h-[calc(100dvh-3rem-4rem)] overflow-y-auto`}>
                    <div className="h-[216px] bg-slate-300">경로 이미지</div>
                    <WalkInfo distance={0} calories={0} duration={0} />
                    <Divider />
                    <div>
                        <h2>함께한 댕댕이</h2>
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <Avatar />
                                <span>
                                    <span>대변 2</span>
                                    <span>소변 3</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Avatar />
                                <span>
                                    <span>대변 2</span>
                                    <span>소변 3</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Avatar />
                                <span>
                                    <span>대변 2</span>
                                    <span>소변 3</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Avatar />
                                <span>
                                    <span>대변 2</span>
                                    <span>소변 3</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Avatar />
                                <span>
                                    <span>대변 2</span>
                                    <span>소변 3</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <h2>사진</h2>
                        <div className="flex flex-row gap-1 overflow-x-auto">
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <h2>메모</h2>
                        <textarea name="memo" className="w-full" />
                    </div>
                </div>
                <Button rounded="none" className="w-full h-16">
                    <span className="-translate-y-[5px]">저장하기</span>
                </Button>
            </div>
        </>
    );
}