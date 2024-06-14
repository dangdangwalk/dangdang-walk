import TopBar from '@/components/commons/Topbar';
import CustomCalendar from '@/components/journals/CustomCalendar';
import JournalCardList from '@/components/journals/JournalCardList';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants';
import useJournals from '@/hooks/useJournals';
import Ic from '@/assets/icons/ic-arrow-right.svg';
import { DogAvatar } from '@/models/dog';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDogs } from '@/api/dog';
import Avatar from '@/components/commons/Avatar';
import SelectBox from '@/components/commons/SelectBox';
import { queryStringKeys } from '@/constants';
import { JournalsState } from '@/components/home/DogStatisticsView';

export default function Journals() {
    const location = useLocation();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const receivedState = location.state as JournalsState;
    const [dogList, setDogList] = useState<DogAvatar[]>(receivedState?.dogs ?? []);
    const [selectedDog, setSelectedDog] = useState<DogAvatar | undefined>(receivedState?.selectedDog);
    const { journals, isJournalsLoading } = useJournals();

    const goBack = () => {
        navigate('/');
    };
    const handleSelectDog = (dogName: string) => {
        const dog = dogList.find((dog) => dog.name === dogName);
        if (!dog) return;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(queryStringKeys.DOG_ID, String(dog.id));
        setSearchParams(newSearchParams);
        setSelectedDog(dog);
    };
    useEffect(() => {
        if (selectedDog) return;
        fetchDogs().then((dogs) => {
            if (dogs) {
                setDogList(dogs);
                setSelectedDog(dogs[0]);
            } else {
                navigate('/');
            }
        });
    }, []);
    return (
        <>
            <TopBar className="bg-white px-5">
                <TopBar.Front onClick={goBack}>
                    <img className="rotate-180" src={Ic} alt="back button" />
                </TopBar.Front>
                <TopBar.Center className="h-full">
                    <SelectBox onChange={handleSelectDog} defaultValue={selectedDog?.name}>
                        <SelectBox.Label className="flex h-12 items-center justify-center">
                            <div>{selectedDog?.name}</div>
                        </SelectBox.Label>
                        <SelectBox.Group>
                            {dogList.map((dog) => (
                                <SelectBox.Option key={dog.id} value={dog.name}>
                                    <Avatar url={dog.profilePhotoUrl} name={dog.name} className="gap-4" />
                                </SelectBox.Option>
                            ))}
                        </SelectBox.Group>
                    </SelectBox>
                </TopBar.Center>
                <TopBar.Back className="w-12"></TopBar.Back>
            </TopBar>
            <main
                className="mb-[60px] flex min-h-dvh flex-col bg-neutral-50"
                style={{ minHeight: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT}  )` }}
            >
                <CustomCalendar dogId={selectedDog?.id} />
                <JournalCardList journals={journals} dog={selectedDog} isLoading={isJournalsLoading} />
            </main>
        </>
    );
}
