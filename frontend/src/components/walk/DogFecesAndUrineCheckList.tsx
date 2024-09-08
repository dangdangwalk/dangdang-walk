import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import { Feces } from '@/components/icons/Feces';
import { Urine } from '@/components/icons/Urine';
import { FecesAndUrine } from '@/hooks/useWalkingDogs';
import { WalkingDog } from '@/models/dog';

interface DogFecesAndUrineCheckListProps {
    dog: WalkingDog;
    toggleCheck: (id: number, key: FecesAndUrine) => void;
    fecesCheckedList: Set<number>;
    urineCheckedList: Set<number>;
}

//Refactor 컴포넌트 이름과 divider 위치
export default function DogFecesAndUrineCheckList({
    dog,
    toggleCheck,
    fecesCheckedList,
    urineCheckedList,
}: DogFecesAndUrineCheckListProps) {
    return (
        <>
            <Divider className="h-0 border border-neutral-200" />
            <li className="flex items-center justify-between py-2" key={dog.id}>
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <div className="flex gap-4">
                    <Checkbox
                        checked={fecesCheckedList.has(dog.id)}
                        onCheckedChange={() => {
                            toggleCheck(dog.id, 'feces');
                        }}
                    >
                        <Feces color={fecesCheckedList.has(dog.id) ? 'primary' : 'secondary'} />
                    </Checkbox>
                    <Checkbox
                        checked={urineCheckedList.has(dog.id)}
                        onCheckedChange={() => {
                            toggleCheck(dog.id, 'urine');
                        }}
                    >
                        <Urine color={urineCheckedList.has(dog.id) ? 'primary' : 'secondary'} />
                    </Checkbox>
                </div>
            </li>
        </>
    );
}
