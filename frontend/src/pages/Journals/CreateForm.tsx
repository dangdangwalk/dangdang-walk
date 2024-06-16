import { create as createJournal } from '@/api/journal';
import { deleteImages, getUploadUrl, uploadImage } from '@/api/upload';
import Cancel from '@/assets/icons/ic-cancel.svg';
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
import CompanionDogSection from '@/components/journals/CompanionDogSection';
import Heading from '@/components/journals/Heading';
import MemoSection from '@/components/journals/MemoSection';
import PhotoSection from '@/components/journals/PhotoSection';
import Map from '@/components/walk/Map';
import WalkInfo from '@/components/walk/WalkInfo';
import useToast from '@/hooks/useToast';
import { WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { useStore } from '@/store';
import { getFileName } from '@/utils/url';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CreateForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { show: showToast } = useToast();

    const addSpinner = useStore((state) => state.spinnerAdd);
    const removeSpinner = useStore((state) => state.spinnerRemove);

    const [openModal, setOpenModal] = useState(false);
    const [imageFileNames, setImageFileNames] = useState<Array<ImageFileName>>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const receivedState = location.state as ReceivedState;

    const {
        dogs,
        distance,
        calories,
        duration,
        startedAt: serializedStartedAt,
        photoUrls: photoFileNames,
        routes,
    } = receivedState;
    const startedAt = new Date(serializedStartedAt);

    useEffect(() => {
        dogs.forEach((dog) => {
            if (!dog.profilePhotoUrl) return;
            dog.profilePhotoUrl = getFileName(dog.profilePhotoUrl);
        });

        setImageFileNames(photoFileNames);
    }, [location]);

    return (
        <>
            <div className="flex flex-col">
                <div className="flex h-12 items-center justify-between pl-5 pr-2">
                    <Heading headingNumber={1}>
                        {startedAt.getMonth() + 1}월 {startedAt.getDate()}일 산책기록
                    </Heading>
                    <button onClick={() => setOpenModal(true)}>
                        <img src={Cancel} alt="cancel" />
                    </button>
                </div>
                <div className={`h-[calc(100dvh-3rem-4rem)] overflow-y-auto`}>
                    <Map
                        startPosition={routes[0]}
                        path={routes}
                        className="overflow-hidden rounded-lg"
                        height="216px"
                    />
                    <WalkInfo distance={distance} calories={calories} duration={duration} />
                    <Divider />
                    <CompanionDogSection
                        dogs={dogs.map((dog) => {
                            return {
                                ...dog,
                                fecesCount: dog.fecesLocations.length,
                                urineCount: dog.urineLocations.length,
                            };
                        })}
                    />
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
                <Button rounded="none" className="h-16 w-full" disabled={isSaving} onClick={handleSave}>
                    저장하기
                </Button>
            </div>
            <Modal open={openModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>산책기록 삭제</ModalTitle>
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

    async function handleSave() {
        setIsSaving(true);
        addSpinner();

        const dogIds = dogs.map((dog) => dog.id);
        const journalInfo = {
            distance,
            calories,
            startedAt: startedAt.toJSON(),
            duration,
            routes,
            photoUrls: photoFileNames ?? [],
            memo: textAreaRef.current?.value ?? '',
        };
        const excrements = dogs.map((dog) => {
            const stringFecesLocations = dog.fecesLocations.map((position) => {
                return {
                    lat: String(position.lat),
                    lng: String(position.lng),
                };
            });
            const stringUrineLocations = dog.fecesLocations.map((position) => {
                return {
                    lat: String(position.lat),
                    lng: String(position.lng),
                };
            });

            return {
                dogId: dog.id,
                fecesLocations: stringFecesLocations,
                urineLocations: stringUrineLocations,
            };
        });

        await createJournal({
            dogs: dogIds,
            journalInfo,
            excrements: excrements ?? [],
        });

        setIsSaving(false);
        removeSpinner();
        showToast('산책 기록이 저장되었습니다.');

        navigate('/');
    }

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
    dogs: WalkingDog[];
    startedAt: string;
    distance: number;
    routes: Position[];
    calories: number;
    duration: number;
    photoUrls: string[];
}

export type ImageFileName = string;
