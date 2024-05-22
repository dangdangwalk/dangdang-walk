import Topbar from '@/components/common/Topbar';
import CustomCalendar from '@/components/journals/CustomCalendar';
import JournalCardList from '@/components/journals/JournalCardList';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import useJournals from '@/hooks/useJournals';
import Ic from '@/assets/icons/ic-arrow.svg';
import { Dog } from '@/models/dog.model';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDogList } from '@/api/dogs';
import Avatar from '@/components/common/Avatar';
import SelectBox from '@/components/common/SelectBox';
import { queryStringKeys } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;
interface ReceivedState {
    dog?: Dog;
    dogs?: Dog[];
}

export default function Journals() {
    const location = useLocation();
    const navigate = useNavigate();
    const { refreshTokenQuery } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const receivedState = location.state as ReceivedState;
    const [dogList, setDogList] = useState<Dog[]>(receivedState?.dogs ?? []);
    const [selectedDog, setSelectedDog] = useState<Dog | undefined>(receivedState?.dog);
    const { journals } = useJournals(refreshTokenQuery.isPending);

    const goBack = () => {
        navigate('/');
    };
    const handleSelectDog = (dogName: string) => {
        const dog = dogList.find((dog) => dog.name === dogName);
        if (!dog) return;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(queryStringKeys.DOGID, String(dog.id));
        setSearchParams(newSearchParams);
        setSelectedDog(dog);
    };
    useEffect(() => {
        if (selectedDog || refreshTokenQuery.isPending) return;
        fetchDogList().then((data) => {
            if (data) {
                const dogs: Dog[] = data.map((dog) => {
                    return {
                        ...dog,
                        profilePhotoUrl: dog.profilePhotoUrl
                            ? `${REACT_APP_BASE_IMAGE_URL}/${dog.profilePhotoUrl}`
                            : undefined,
                    };
                });
                setDogList(dogs);
                setSelectedDog(dogs[0]);
            } else {
                navigate('/');
            }
        });
    }, [refreshTokenQuery.isPending]);
    return (
        <>
            <Topbar className="bg-white px-5">
                <Topbar.Front onClick={goBack}>
                    <img className="rotate-180" src={Ic} alt="back button" />
                </Topbar.Front>
                <Topbar.Center className="h-full">
                    <SelectBox onChange={handleSelectDog} defaultValue={selectedDog?.name}>
                        <SelectBox.Label className=" flex h-12  justify-center items-center">
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
