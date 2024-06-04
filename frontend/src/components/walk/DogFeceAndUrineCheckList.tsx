import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import { Feces } from '@/components/icons/Feces';
import { Urine } from '@/components/icons/Urine';
import { WalkingDog } from '@/models/dog';

interface DogFeceAndUrineCheckListProps {
    dog: WalkingDog;
    toggleCheck: (id: number, key: keyof WalkingDog) => void;
}

//Refactor 컴포넌트 이름과 divider 위치
export default function DogFeceAndUrineCheckList({ dog, toggleCheck }: DogFeceAndUrineCheckListProps) {
    return (
        <>
            <Divider className="h-0 border border-neutral-200" />
            <li className="flex items-center justify-between py-2" key={dog.id}>
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <div className="flex gap-1">
                    <Checkbox
                        checked={dog?.isFeceChecked}
                        onCheckedChange={() => {
                            toggleCheck(dog.id, 'isFeceChecked');
                        }}
                    >
                        <Feces color={dog.isFeceChecked ? 'primary' : 'secondary'} />
                    </Checkbox>
                    <Checkbox
                        checked={dog?.isUrineChecked}
                        onCheckedChange={() => {
                            toggleCheck(dog.id, 'isUrineChecked');
                        }}
                    >
                        <Urine color={dog.isUrineChecked ? 'primary' : 'secondary'} />
                    </Checkbox>
                </div>
            </li>
        </>
    );
}
