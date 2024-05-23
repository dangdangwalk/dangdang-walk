import Distance from '@/classes/Distance';
import { Divider } from '@/components/common/Divider';
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
                `w-full h-16 px-5 mt-4 pb-1 bg-white justify-between items-center gap-[5px] inline-flex ${className}`
            )}
        >
            <div className="flex flex-col h-15 w-[100px] justify-center items-center">
                <div className=" text-amber-500 text-lg font-bold leading-[27px]">{distance.formatedDistance}</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">{distance.unit}</div>
            </div>
            {isDivider && <Divider orientation={'vertical'} />}
            <div className="flex flex-col w-[100px] justify-center items-center">
                <div className="text-amber-500 text-lg font-bold leading-[27px]">{calories}</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">kcal</div>
            </div>
            {isDivider && <Divider orientation={'vertical'} />}
            <div className="flex flex-col w-[100px] justify-center items-center">
                <div className="text-amber-500 text-lg font-bold leading-[27px]">{timeFormat(duration)}</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">시간</div>
            </div>
        </div>
    );
}
