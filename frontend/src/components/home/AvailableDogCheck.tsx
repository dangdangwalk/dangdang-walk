import Avatar from '@/components/common/Avatar';
import { Checkbox } from '@/components/common/Checkbox2';
import { Divider } from '@/components/common/Divider';
import { AvailableDog } from '@/pages/Home';

export const AvailableDogCheck = ({ dog, onToggle }: { dog: AvailableDog; onToggle: (id: number) => void }) => {
    return (
        <>
            <Divider key={`Divider - ${dog.id}`} className="h-0 border border-neutral-200" />
            <li key={dog.id} className="flex py-2 justify-between items-center">
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
};
