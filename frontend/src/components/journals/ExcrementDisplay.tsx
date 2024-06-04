import { Feces } from '@/components/icons/Feces';
import { Urine } from '@/components/icons/Urine';
import IconAndNumberDisplay from '@/components/journals/IconAndNumberDisplay';

export default function ExcrementDisplay({ fecesCount = 0, urineCount = 0 }: Props) {
    return (
        <span className="flex gap-[6px]">
            <IconAndNumberDisplay color={isPositiveNumber(fecesCount) ? 'primary' : 'secondary'} count={fecesCount}>
                <Feces color={isPositiveNumber(fecesCount) ? 'primary' : 'secondary'} className="w-5" />
            </IconAndNumberDisplay>
            <IconAndNumberDisplay color={isPositiveNumber(urineCount) ? 'primary' : 'secondary'} count={urineCount}>
                <Urine color={isPositiveNumber(urineCount) ? 'primary' : 'secondary'} className="w-5" />
            </IconAndNumberDisplay>
        </span>
    );
}

function isPositiveNumber(number: number) {
    return number > 0;
}

interface Props {
    fecesCount: number;
    urineCount: number;
}
