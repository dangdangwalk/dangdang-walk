import Cancel from '@/assets/icons/ic-top-cancel.svg';
import Avatar from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import {
    Modal,
    ModalAction,
    ModalCancel,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '@/components/common/Modal';
import Topbar from '@/components/common/Topbar';
import ExcrementDisplay from '@/components/journals/ExcrementDisplay';
import WalkInfo from '@/components/walk/WalkInfo';
import useToast from '@/hooks/useToast';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateForm() {
    const navigate = useNavigate();
    const { show: showToast } = useToast();

    const [openModal, setOpenModal] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const FAKE_EXCREMENTS: Array<Excrement> = [
        {
            dogId: 1,
            fecesLocations: [
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
            ],
            urineLocations: [
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
            ],
        },
        {
            dogId: 2,
            fecesLocations: [{ lat: 123.45435435, lng: 456.3463465 }],
            urineLocations: [
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
            ],
        },
        {
            dogId: 3,
            fecesLocations: [{ lat: 8568.45435435, lng: 456.3463465 }],
            urineLocations: [
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
            ],
        },
        {
            dogId: 4,
            fecesLocations: [],
            urineLocations: [
                { lat: 456.45435435, lng: 32555.3463465 },
                { lat: 7477.45435435, lng: 346346.3463465 },
            ],
        },
        {
            dogId: 5,
            fecesLocations: [],
            urineLocations: [],
        },
        {
            dogId: 6,
            fecesLocations: [{ lat: 8568.45435435, lng: 456.3463465 }],
            urineLocations: [
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
            ],
        },
        {
            dogId: 7,
            fecesLocations: [{ lat: 8568.45435435, lng: 456.3463465 }],
            urineLocations: [
                { lat: 123.45435435, lng: 456.3463465 },
                { lat: 123.45435435, lng: 456.3463465 },
            ],
        },
        {
            dogId: 8,
            fecesLocations: [{ lat: 8568.45435435, lng: 456.3463465 }],
            urineLocations: [],
        },
    ];

    return (
        <>
            <div className="flex flex-col">
                <Topbar>
                    <Topbar.Center className="text-center text-lg font-bold leading-[27px]">
                        <h1>5월 2일 산책기록</h1>
                    </Topbar.Center>
                    <Topbar.Back className="w-12 flex items-center">
                        <button onClick={() => setOpenModal(true)}>
                            <img src={Cancel} alt="cancel" />
                        </button>
                    </Topbar.Back>
                </Topbar>
                <div className={`h-[calc(100dvh-3rem-4rem)] overflow-y-auto`}>
                    <div className="h-[216px] bg-slate-300">경로 이미지</div>
                    <WalkInfo distance={0} calories={0} duration={0} />
                    <Divider />
                    <div>
                        <h2>함께한 댕댕이</h2>
                        <div className="flex flex-col">
                            {FAKE_EXCREMENTS.map((excrement) => (
                                <div key={excrement.dogId} className="flex justify-between">
                                    <Avatar />
                                    <ExcrementDisplay
                                        fecesCount={excrement.fecesLocations.length}
                                        urineCount={excrement.urineLocations.length}
                                    />
                                </div>
                            ))}
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
                        <textarea name="memo" className="w-full" ref={textAreaRef} />
                    </div>
                </div>
                <Button rounded="none" className="w-full h-16">
                    <span className="-translate-y-[5px]">저장하기</span>
                </Button>
            </div>
            <Modal open={openModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>산책기록삭제</ModalTitle>
                        <ModalDescription>오늘한 산책을 기록에서 삭제할까요?</ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <ModalCancel onClick={() => setOpenModal(false)}>취소</ModalCancel>
                        <ModalAction onClick={handleCancelSave}>삭제하기</ModalAction>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

    function handleCancelSave() {
        showToast('산책 기록이 삭제되었습니다.');

        navigate('/');
    }
}

interface Location {
    lat: number;
    lng: number;
}

interface Excrement {
    dogId: number;
    fecesLocations: Array<Location>;
    urineLocations: Array<Location>;
}
