import DogBottomSheet from '@/components/walk/DogBottomSheet';
import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useWalkStore } from '@/store/walkStore';
import { useState } from 'react';
import Avatar from '@/components/common/Avatar';
import { Divider } from '@/components/common/Divider';
import AllDogs from '@/assets/icons/walk/frame-5058.svg';
import DogCheckBox from '@/components/walk/DogCheckBox';

const dogs = [
    {
        id: 1, // 강아지 id
        name: '덕지', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg', // 강아지 사진
        isChecked: false,
    },
    {
        id: 2, // 강아지 id
        name: '철도', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg', // 강아지 사진
        isChecked: true,
    },
    {
        id: 3, // 강아지 id
        name: '', //강아지 이름
        photoUrl: '', // 강아지 사진
        isChecked: false,
    },
];

export default function Walk() {
    const { isWalk } = useWalkStore();
    const [availableDog, setAvailableDog] = useState(dogs);

    const handleDogSelect = (id: number) => {
        if (id < 0) {
            setAvailableDog(availableDog.map((d: any) => ({ ...d, isChecked: !d.isChecked })));
            return;
        }
        setAvailableDog(availableDog.map((d: any) => (d.id === id ? { ...d, isChecked: !d.isChecked } : d)));
        // setAvailableDog([]);
    };
    return (
        <>
            {isWalk && (
                <>
                    <WalkHeader />
                    <WalkInfo />
                </>
            )}
            <Map />
            <WalkNavbar />

            <DogBottomSheet
                isOpen={!isWalk}
                onClose={() => {}}
                disabled={availableDog.find((d) => d.isChecked) ? false : true}
            >
                {availableDog.length > 1 && (
                    <>
                        <Divider className="h-0 border border-neutral-200" />
                        <li className="flex py-2 justify-between items-center">
                            <Avatar url={AllDogs} name={'다함께'} />
                            <DogCheckBox id={-1} isChecked={false} onChange={handleDogSelect} />
                        </li>
                    </>
                )}
                {availableDog.map((dog) => (
                    <>
                        <Divider key={`${dog.id}-divider`} className="h-0 border border-neutral-200" />
                        <li className="flex py-2 justify-between items-center" key={dog.id}>
                            <Avatar url={dog.photoUrl} name={dog.name} />
                            <DogCheckBox id={dog.id} isChecked={dog.isChecked} onChange={handleDogSelect} />
                        </li>
                    </>
                ))}
            </DogBottomSheet>
        </>
    );
}
