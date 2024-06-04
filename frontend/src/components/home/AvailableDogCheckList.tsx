import AllDogs from '@/assets/icons/ic-default-dog.svg';
import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { AvailableDogCheck } from '@/components/home/AvailableDogCheck';
import { AvailableDog } from '@/models/dog';
import { useState } from 'react';

export default function AvailableDogCheckList({
    dogs,
    onToggle,
    checkAll,
}: {
    dogs: AvailableDog[] | undefined;
    onToggle: (id: number) => void;
    checkAll: (flag: boolean) => void;
}) {
    const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
    const onCheckAll = (flag: boolean) => {
        setIsCheckedAll(flag);
        checkAll(flag);
    };
    return (
        <>
            <li className="flex items-center justify-between py-2">
                <Avatar url={AllDogs} name={'다 함께'} />
                <Checkbox
                    checked={isCheckedAll}
                    onCheckedChange={() => {
                        onCheckAll(!isCheckedAll);
                    }}
                ></Checkbox>
            </li>
            {dogs?.map((dog) => <AvailableDogCheck dog={dog} key={dog.id} onToggle={onToggle} />)}
        </>
    );
}
