import AllDogs from '@/assets/icons/ic-default-dog.svg';
import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { AvailableDogCheck } from '@/components/home/AvailableDogCheck';
import { WalkAvailableDog } from '@/models/dog';

interface AvailableDogCheckListProps {
    dogs: WalkAvailableDog[];
    onToggle: (id: number) => void;
    checkAll: (flag: boolean) => void;
}
export default function AvailableDogCheckList({ dogs, onToggle, checkAll }: AvailableDogCheckListProps) {
    const isCheckedAll = dogs.length === dogs.filter((dog) => dog.isChecked).length;
    return (
        <>
            <li className="flex items-center justify-between py-3">
                <Avatar url={AllDogs} name={'다 함께'} />
                <Checkbox
                    checked={isCheckedAll}
                    onCheckedChange={() => {
                        checkAll(!isCheckedAll);
                    }}
                ></Checkbox>
            </li>
            {dogs.map((dog) => (
                <AvailableDogCheck dog={dog} key={dog.id} onToggle={onToggle} />
            ))}
        </>
    );
}
