import Distance from '@/classes/Distance';
import { Divider } from '@/components/commons/Divider';
import { timeFormat } from '@/utils/format';
import { cn } from '@/utils/tailwindClass';

interface WalkInfoProps {
    duration: number;
    calories: number;
    distance: number;
    isDivider?: boolean;
    className?: string;
}
export default function WalkInfo({
    duration,
    calories,
    distance: rawDistance,
    isDivider = true,
    className,
}: WalkInfoProps) {
    const distance = new Distance(rawDistance);
    return (
        <div
            className={cn(
                `mt-4 inline-flex h-16 w-full items-center justify-between gap-[5px] bg-white px-5 pb-1 ${className}`
            )}
        >
            <div className="h-15 flex w-[100px] flex-col items-center justify-center">
                <div className="text-lg font-bold leading-[27px] text-amber-500">{distance.formatedDistance}</div>
                <div className="text-center text-xs font-normal leading-[18px] text-stone-500">{distance.unit}</div>
            </div>
            {isDivider && <Divider orientation={'vertical'} />}
            <div className="flex w-[100px] flex-col items-center justify-center">
                <div className="text-lg font-bold leading-[27px] text-amber-500">{calories}</div>
                <div className="text-center text-xs font-normal leading-[18px] text-stone-500">kcal</div>
            </div>
            {isDivider && <Divider orientation={'vertical'} />}
            <div className="flex w-[100px] flex-col items-center justify-center">
                <div className="text-lg font-bold leading-[27px] text-amber-500">{timeFormat(duration)}</div>
                <div className="text-center text-xs font-normal leading-[18px] text-stone-500">시간</div>
            </div>
        </div>
    );
}
