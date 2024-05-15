import { Feces } from '@/components/icon/Feces';
import { Urine } from '@/components/icon/Urine';

export default function ExcrementDisplay({ fecesCount = 0, urineCount = 0 }: Props) {
    return (
        <span className="flex gap-[6px]">
            <span className="flex gap-[6px]">
                <Feces color={fecesCount ? 'primary' : 'secondary'} className="w-5" />
                <span className={fecesCount ? 'text-[#222222]' : 'text-[#BBBBBB]'}>{fecesCount}</span>
            </span>
            <span className="flex gap-[6px]">
                <Urine color={urineCount ? 'primary' : 'secondary'} className="w-5" />
                <span className={urineCount ? 'text-[#222222]' : 'text-[#BBBBBB]'}>{urineCount}</span>
            </span>
        </span>
    );
}

interface Props {
    fecesCount?: number;
    urineCount?: number;
}
