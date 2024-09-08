import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import { DogAvatar } from '@/models/dog';

export const AvailableDogCheck = ({
    dog,
    onToggle,
    checkedList,
}: {
    dog: DogAvatar;
    onToggle: (id: number) => void;
    checkedList: Set<number>;
}) => {
    return (
        <>
            <Divider key={`Divider - ${dog.id}`} className="h-0 border-t border-neutral-200" />
            <li key={dog.id} className="flex items-center justify-between py-3">
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <Checkbox
                    checked={checkedList.has(dog.id)}
                    onCheckedChange={() => {
                        onToggle(dog.id);
                    }}
                ></Checkbox>
            </li>
        </>
    );
};
