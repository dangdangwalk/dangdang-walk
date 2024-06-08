import Avatar from '@/components/commons/Avatar';
import { Checkbox } from '@/components/commons/Checkbox';
import { Divider } from '@/components/commons/Divider';
import { WalkAvailableDog } from '@/models/dog';

export const AvailableDogCheck = ({ dog, onToggle }: { dog: WalkAvailableDog; onToggle: (id: number) => void }) => {
    return (
        <>
            <Divider key={`Divider - ${dog.id}`} className="h-0 border-t border-neutral-200" />
            <li key={dog.id} className="flex items-center justify-between py-3">
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
