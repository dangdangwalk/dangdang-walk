/* eslint-disable @typescript-eslint/no-unused-vars */
import { JournalDetail } from '@/api/journals';
import { deleteImages, getUploadUrl, uploadImage } from '@/api/upload';
import Cancel from '@/assets/icons/ic-top-cancel.svg';
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
import CompanionDogSection, { Dog } from '@/components/journals/CompanionDogSection2';
import Heading from '@/components/journals/Heading';
import MemoSection from '@/components/journals/MemoSection';
import PhotoSection from '@/components/journals/PhotoSection';
import Map from '@/components/walk/Map';
import WalkInfo from '@/components/walk/WalkInfo';
import useToast from '@/hooks/useToast';
import { useSpinnerStore } from '@/store/spinnerStore';
import { getFileName } from '@/utils/url';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';

export default function Detail() {
    const journalDetail = useLoaderData() as JournalDetail;
    console.log(journalDetail);
    const { journalInfo, dogs: dogsFromAPI, excrements = [] } = journalDetail;
    const { routes, memo, photoUrls: photoFileNames } = journalInfo;

    const navigate = useNavigate();
    const location = useLocation();
    const { show: showToast } = useToast();

    const addSpinner = useSpinnerStore((state) => state.spinnerAdd);
    const removeSpinner = useSpinnerStore((state) => state.spinnerRemove);

    const [openModal, setOpenModal] = useState(false);
    const [imageFileNames, setImageFileNames] = useState<Array<ImageFileName>>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const {
        dogName,
        journalCnt: journalCount,
        startedAt: serializedStartedAt,
        calories,
        duration,
        distance,
    } = receivedState;
    const startedAt = new Date(serializedStartedAt);

    const dogs: Array<Dog> = dogsFromAPI.map((dog) => {
        const foundExcrement = excrements.find((excrement) => excrement.dogId === dog.id);
        const fecesCount = foundExcrement?.fecesCnt ?? 0;
        const urineCount = foundExcrement?.urineCnt ?? 0;

        return { ...dog, fecesCount, urineCount };
    });

    useEffect(() => {
        dogs.forEach((dog) => {
            if (dog.profilePhotoUrl === undefined) return;
            dog.profilePhotoUrl = getFileName(dog.profilePhotoUrl);
        });

        setImageFileNames(photoFileNames);
    }, [location]);

    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between items-center h-12 pl-5 pr-2">
                    <Heading headingNumber={1}>
                        {dogName}의 {journalCount}번째 산책
                    </Heading>
                    <button onClick={() => setOpenModal(true)}>
                        <img src={Cancel} alt="cancel" />
                    </button>
                </div>
                <div className={`h-[calc(100dvh-3rem-4rem)] overflow-y-auto`}>
                    <Map
                        startPosition={routes[0]}
                        path={routes}
                        className="rounded-lg overflow-hidden"
                        height="216px"
                    />
                    <WalkInfo distance={distance} calories={calories} duration={duration} />
                    <Divider />
                    <CompanionDogSection dogs={dogs} />
                    <Divider />
                    <PhotoSection
                        imageFileNames={imageFileNames}
                        isLoading={isUploading}
                        isModifying
                        onChange={handleAddImages}
                        onDeleteImage={handleDeleteImage}
                    />
                    <Divider />
                    <MemoSection textAreaRef={textAreaRef} />
                </div>
                <Button rounded="none" className="w-full h-16" disabled={isSaving}>
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

    // async function handleSave() {
    //     setIsSaving(true);
    //     addSpinner();

    //     const dogIds = dogs.map((dog) => dog.id);
    //     const journalInfo = {
    //         distance,
    //         calories,
    //         startedAt: startedAt.toJSON(),
    //         duration,
    //         routes,
    //         photoUrls: photoFileNames ?? [],
    //         memo: textAreaRef.current?.value ?? '',
    //     };
    //     const excrements = dogs.map((dog) => {
    //         const stringFecesLocations = dog.fecesLocations.map((position) => {
    //             return {
    //                 lat: String(position.lat),
    //                 lng: String(position.lng),
    //             };
    //         });
    //         const stringUrineLocations = dog.fecesLocations.map((position) => {
    //             return {
    //                 lat: String(position.lat),
    //                 lng: String(position.lng),
    //             };
    //         });

    //         return {
    //             dogId: dog.id,
    //             fecesLocations: stringFecesLocations,
    //             urineLocations: stringUrineLocations,
    //         };
    //     });

    //     await createJournal({
    //         dogs: dogIds,
    //         journalInfo,
    //         excrements: excrements ?? [],
    //     });

    //     setIsSaving(false);
    //     removeSpinner();
    //     showToast('산책 기록이 저장되었습니다.');

    //     navigate('/');
    // }

    function handleCancelSave() {
        showToast('산책 기록이 삭제되었습니다.');

        navigate('/');
    }

    async function handleAddImages(e: FormEvent<HTMLInputElement>) {
        const files = e.currentTarget.files;

        if (files === null) return;
        setIsUploading(true);

        const fileTypes = Array.from(files).map((file) => file.type);
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
