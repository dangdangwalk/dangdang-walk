import Avatar from '@/components/common/Avatar';
import { Checkbox } from '@/components/common/Checkbox2';
import { Divider } from '@/components/common/Divider';
import { Feces } from '@/components/icon/Feces';
import { Urine } from '@/components/icon/Urine';
import { WalkingDog } from '@/models/dog.model';
import React from 'react';

interface DogFeceAndUrineCheckListProps {
    dog: WalkingDog;
    toggleFeceCheck: (id: number) => void;
    toggleUrineCheck: (id: number) => void;
}

//Refactor 컴포넌트 이름과 divider 위치
export default function DogFeceAndUrineCheckList({
    dog,
    toggleFeceCheck,
    toggleUrineCheck,
}: DogFeceAndUrineCheckListProps) {
    return (
        <>
            <Divider className="h-0 border border-neutral-200" />
            <li className="flex items-center justify-between py-2" key={dog.id}>
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <div className="flex gap-1">
                    <Checkbox
                        checked={dog?.isFeceChecked}
                        onCheckedChange={() => {
                            toggleFeceCheck(dog.id);
                        }}
                    >
                        <Feces color={dog.isFeceChecked ? 'primary' : 'secondary'} />
                    </Checkbox>
                    <Checkbox
                        checked={dog?.isUrineChecked}
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
