import Avatar from '@/components/common/Avatar';
import { Checkbox } from '@/components/common/Checkbox2';
import { Divider } from '@/components/common/Divider';
import { AvailableDog } from '@/pages/Home';

export default function AvailableDogCheckList({
    dog,
    onToggle,
}: {
    dog: AvailableDog;
    onToggle: (id: number) => void;
}) {
    return (
        <>
            <Divider className="h-0 border border-neutral-200" />
            <li className="flex py-2 justify-between items-center" key={dog.id}>
                <Avatar url={dog.profilePhotoUrl} name={dog.name} />
                <Checkbox
                    checked={dog.isChecked}
                    onCheckedChange={() => {
                        onToggle(dog.id);
                    }}
                ></Checkbox>
            </li>
        </>
    );
}
