import Topbar from '@/components/common/Topbar';
import CustomCalendar from '@/components/journals/CustomCalendar';
import JournalCardList from '@/components/journals/JournalCardList';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import useJournals from '@/hooks/useJournals';
import Ic from '@/assets/icons/ic-arrow.svg';
import { Dog } from '@/models/dog.model';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ReceivedState {
    dog?: Dog;
    dogs?: Dog[];
}

export default function Journals() {
    const location = useLocation();
    const receivedState = location.state as ReceivedState;
    const [dogs, setDogs] = useState<Dog[]>(receivedState?.dogs ?? []);
    const [selectedDog, setSelectedDog] = useState<Dog | undefined>(receivedState?.dog);
    const { journals } = useJournals();
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        if (selectedDog) return;
        console.log('no dog');
    }, []);
    return (
        <>
            <Topbar className="bg-white ">
                <Topbar.Front onClick={goBack}>
                    <img className="rotate-180" src={Ic} alt="back button" />
                </Topbar.Front>
                <Topbar.Center></Topbar.Center>
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
