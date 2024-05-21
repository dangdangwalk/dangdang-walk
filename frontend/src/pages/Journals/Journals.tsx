import Topbar from '@/components/common/Topbar';
import CustomCalendar from '@/components/journals/CustomCalendar';
import JournalCardList from '@/components/journals/JournalCardList';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import useJournals from '@/hooks/useJournals';
import Ic from '@/assets/icons/ic-arrow.svg';
import { Dog } from '@/models/dog.model';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDogList } from '@/api/dogs';
import Avatar from '@/components/common/Avatar';
import SelectBox from '@/components/common/SelectBox';
import IcDrop from '@/assets/icons/ic-drop-down.svg';

interface ReceivedState {
    dog?: Dog;
    dogs?: Dog[];
}

export default function Journals() {
    const location = useLocation();
    const receivedState = location.state as ReceivedState;
    const [dogList, setDogList] = useState<Dog[]>(receivedState?.dogs ?? []);
    const [selectedDog, setSelectedDog] = useState<Dog | undefined>(receivedState?.dog);
    const { journals } = useJournals();
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/');
    };
    useEffect(() => {
        if (selectedDog) return;
        fetchDogList().then((data) => {
            if (data) {
                setDogList(data);
                setSelectedDog(data[0]);
            } else {
                navigate('/');
            }
        });
    }, []);
    return (
        <>
            <Topbar className="bg-white ">
                <Topbar.Front onClick={goBack}>
                    <img className="rotate-180" src={Ic} alt="back button" />
                </Topbar.Front>
                <Topbar.Center>
                    <SelectBox>
                        <SelectBox.Label className="h-12 flex justify-center items-center">
                            <span>{selectedDog?.name}</span>
                            <img src={IcDrop} alt="select box" />
                        </SelectBox.Label>
                        <SelectBox.Group>
                            {dogList.map((dog) => (
                                <SelectBox.Item key={dog.id} onClick={() => setSelectedDog(dog)}>
                                    <Avatar url={dog.profilePhotoUrl} name={dog.name} className="gap-4" />
                                </SelectBox.Item>
                            ))}
                        </SelectBox.Group>
                    </SelectBox>
                </Topbar.Center>
                <Topbar.Back className="w-12"></Topbar.Back>
            </Topbar>
            <main
                className="flex flex-col bg-neutral-50 mb-[60px] min-h-dvh"
                style={{ minHeight: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT}  )` }}
            >
                <CustomCalendar />
                <JournalCardList journals={journals} dog={selectedDog} />
            </main>
        </>
    );
}
