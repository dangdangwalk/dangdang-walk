import { JournalDetail, remove as removeJournal, update as updateJournal } from '@/api/journal';
import queryClient from '@/api/queryClient';
import { deleteImages, getUploadUrl, uploadImage } from '@/api/upload';
import { ReactComponent as Arrow } from '@/assets/icons/ic-arrow-right.svg';
import { ReactComponent as Meatball } from '@/assets/icons/ic-meatball.svg';
import BottomSheet from '@/components/commons/BottomSheet';
import { Button } from '@/components/commons/Button';
import { Divider } from '@/components/commons/Divider';
import {
    Modal,
    ModalAction,
    ModalCancel,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '@/components/commons/Modal';
import CompanionDogSection, { CompanionDog } from '@/components/journals/CompanionDogSection';
import Heading from '@/components/journals/Heading';
import MemoSection from '@/components/journals/MemoSection';
import Navbar from '@/components/journals/Navbar';
import PhotoSection from '@/components/journals/PhotoSection';
import Map from '@/components/walk/Map';
import WalkInfo from '@/components/walk/WalkInfo';
import { queryKeys } from '@/constants';
import useJournal from '@/hooks/useJournal';
import useToast from '@/hooks/useToast';
import { useStore } from '@/store';
import { getFileName } from '@/utils/url';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function Detail() {
    const params = useParams();
    const journalDetail = useJournal(Number(params.journalId));
    const { journalInfo, dogs: dogsFromAPI } = journalDetail as JournalDetail;
    const { id: journalId, routes, memo, journalPhotos, excrementCount = [] } = journalInfo;

    const navigate = useNavigate();
    const location = useLocation();
    const { show: showToast } = useToast();

    const addSpinner = useStore((state) => state.spinnerAdd);
    const removeSpinner = useStore((state) => state.spinnerRemove);

    const [openModal, setOpenModal] = useState(false);
    const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
    const [imageFileNames, setImageFileNames] = useState<Array<ImageFileName>>(journalPhotos);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModifying, setIsModifying] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const receivedState =
        (location.state as ReceivedState) ??
        ({
            dogName: '골댕이',
            startedAt: '1718-03-30 12:32:08',
            journalCnt: 1,
            calories: 20,
            distance: 30,
            duration: 131,
        } as ReceivedState);

    const { dogName, journalCnt: journalCount, calories, duration, distance } = receivedState;

    const dogs: Array<CompanionDog> = dogsFromAPI.map((dog) => {
        const foundExcrement = excrementCount.find((excrement) => excrement.dogId === dog.id);
        const fecesCount = foundExcrement?.fecesCnt ?? 0;
        const urineCount = foundExcrement?.urineCnt ?? 0;

        return { ...dog, fecesCount, urineCount };
    });

    useEffect(() => {
        dogs.forEach((dog) => {
            if (!dog.profilePhotoUrl) return;
            dog.profilePhotoUrl = getFileName(dog.profilePhotoUrl);
        });
    }, [location]);

    useEffect(() => {
        if (textAreaRef.current === null) return;
        textAreaRef.current.value = memo;

        setImageFileNames(journalPhotos);
    }, [journalDetail]);

    return (
        <>
            <div className="flex flex-col">
                <div className="flex h-12 items-center justify-between px-5">
                    <button className="flex size-12 items-center justify-center" onClick={handleGoBack}>
                        <Arrow className="rotate-180" />
                    </button>
                    <Heading headingNumber={1} className="translate-x-[-15px]">
                        {dogName}의 {journalCount}번째 산책
                    </Heading>
                    <button
                        className="flex size-12 items-center justify-center"
                        onClick={() => setIsBottomsheetOpen(true)}
                    >
                        <Meatball />
                    </button>
                </div>
                <div className={`h-[calc(100dvh-3rem-4rem)] overflow-y-auto`}>
                    <Map
                        startPosition={routes[0] ? { lat: routes[0][0], lng: routes[0][1] } : null}
                        path={routes}
                        className="overflow-hidden rounded-lg"
                        height="216px"
                    />
                    <WalkInfo distance={distance} calories={calories} duration={duration} />
                    <Divider />
                    <CompanionDogSection dogs={dogs} />
                    <Divider />
                    <PhotoSection
                        imageFileNames={imageFileNames}
                        isLoading={isUploading}
                        isModifying={isModifying}
                        onChange={handleAddImages}
                        onDeleteImage={handleDeleteImage}
                    />
                    <Divider />
                    <MemoSection textAreaRef={textAreaRef} disabled={!isModifying} />
                </div>
                {isModifying ? (
                    <Button rounded="none" className="h-16 w-full" disabled={isSaving} onClick={handleSave}>
                        저장하기
                    </Button>
                ) : (
                    <Navbar />
                )}
            </div>
            <Modal open={openModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>산책기록 삭제</ModalTitle>
                        <ModalDescription>산책기록을 삭제하시겠어요?</ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <ModalCancel onClick={() => setOpenModal(false)}>취소</ModalCancel>
                        <ModalAction onClick={handleCancelSave}>삭제하기</ModalAction>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <BottomSheet isOpen={isBottomsheetOpen} onClose={() => setIsBottomsheetOpen(false)}>
                <BottomSheet.Body className="h-auto overflow-y-visible px-0">
                    <Button
                        rounded="none"
                        className="h-[60px] w-full bg-white text-base font-normal text-label-normal"
                        onClick={handleModify}
                    >
                        수정하기
                    </Button>
                    <Divider className="h-px" />
                    <Button
                        rounded="none"
                        className="h-[60px] w-full bg-white text-base font-normal text-label-normal"
                        onClick={() => setOpenModal(true)}
                    >
                        삭제하기
                    </Button>
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton onConfirm={() => setIsBottomsheetOpen(false)} disabled={false}>
                    취소
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </>
    );

    async function handleSave() {
        setIsSaving(true);
        addSpinner();

        const memo = textAreaRef.current?.value ?? '';
        const journalPhotos = imageFileNames;
        await updateJournal(journalId, { memo, journalPhotos });
        queryClient.invalidateQueries({ queryKey: [queryKeys.JOURNAL, journalId] });
        setIsSaving(false);
        removeSpinner();
        showToast('산책 기록이 저장되었습니다.');

        navigate(-1);
    }

    async function handleCancelSave() {
        await removeJournal(journalId);

        showToast('산책 기록이 삭제되었습니다.');

        navigate(-1);
    }

    function getFileType(file: File) {
        let fileType: string = file.type.split('/').pop()?.toLowerCase() || '';
        if (fileType === '') {
            fileType = file.name.split('.').pop()?.toLowerCase() || '';
        }
        return fileType;
    }

    async function handleAddImages(e: FormEvent<HTMLInputElement>) {
        const files = e.currentTarget.files;

        if (files === null) return;
        setIsUploading(true);

        const fileTypes: string[] = Array.from(files).map((file) => getFileType(file));
        const uploadUrlResponses = await getUploadUrl(fileTypes);
        const uploadUrls = uploadUrlResponses.map((uploadUrlResponse) => uploadUrlResponse.url);

        const uploadImagePromises = uploadUrls.map((uploadUrl, index) => {
            return uploadImage(files[index]!, uploadUrl);
        });
        await Promise.allSettled(uploadImagePromises);

        const filenames = uploadUrlResponses.map((uploadUrlResponse) => uploadUrlResponse.filename);
        setImageFileNames((prevImageFileNames) => [...prevImageFileNames, ...filenames]);
        setIsUploading(false);
    }

    async function handleDeleteImage(imageFileName: ImageFileName) {
        await deleteImages([imageFileName]);

        setImageFileNames((prevImageFileNames) =>
            prevImageFileNames.filter((prevImageFileName) => prevImageFileName !== imageFileName)
        );
        showToast('사진이 삭제되었습니다.');
    }

    function handleGoBack() {
        navigate(-1);
    }

    function handleModify() {
        setIsModifying(true);
        setIsBottomsheetOpen(false);
    }
}

interface ReceivedState {
    dogName: string;
    journalCnt: number;
    startedAt: string;
    calories: number;
    duration: number;
    distance: number;
}

export type ImageFileName = string;

export default Detail;
