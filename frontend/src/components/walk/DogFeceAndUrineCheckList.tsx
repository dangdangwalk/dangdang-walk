import Avatar from '@/components/common/Avatar';
import { Divider } from '@/components/common/Divider';
import { Feces } from '@/components/icon/Feces';
import { Urine } from '@/components/icon/Urine';
import { WalkingDog } from '@/models/dog.model';
import { Checkbox } from '@radix-ui/react-checkbox';
import React from 'react';

interface DogFeceAndUrineCheckListProps {
    dog: WalkingDog;
    toggleFeceCheck: (id: number) => void;
    toggleUrineCheck: (id: number) => void;
}

export default function DogFeceAndUrineCheckList({
    dog,
    toggleFeceCheck,
    toggleUrineCheck,
}: DogFeceAndUrineCheckListProps) {
    return (
        <>
            <Divider className="h-0 border border-neutral-200" />
            <li className="flex py-2 justify-between items-center" key={dog.id}>
                <Avatar url={dog.photoUrl} name={dog.name} />
                <div className="flex gap-1">
                    <Checkbox
                        checked={dog.isFeceChecked}
                        onCheckedChange={() => {
                            toggleFeceCheck(dog.id);
                        }}
                    >
                        <Feces color={dog.isFeceChecked ? 'primary' : 'secondary'} />
                    </Checkbox>
                    <Checkbox
                        checked={dog.isUrineChecked}
                        onCheckedChange={() => {
                            toggleUrineCheck(dog.id);
                        }}
                    >
                        <Urine color={dog.isUrineChecked ? 'primary' : 'secondary'} />
                    </Checkbox>
                </div>
            </li>
        </>
    );
}
