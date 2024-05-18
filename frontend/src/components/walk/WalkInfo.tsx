import { Divider } from '@/components/common/Divider';
import { distanceFormat, timeFormat } from '@/utils/format';
import { cn } from '@/utils/tailwind-class';

interface WalkInfoProps {
    duration: number;
    calories: number;
    distance: number;
    isDivider?: boolean;
    className?: string;
}
export default function WalkInfo({ duration, calories, distance, isDivider = true, className }: WalkInfoProps) {
    return (
        <div
            className={cn(
                `w-full h-16 px-5 mt-4 pb-1 bg-white justify-between items-center gap-[5px] inline-flex ${className}`
            )}
        >
            <div className="flex flex-col h-15 w-[100px] justify-center items-center">
                <div className=" text-amber-500 text-lg font-bold leading-[27px]">{distanceFormat(distance)}</div>
                <div className="text-center text-stone-500 text-xs font-normal leading-[18px]">km</div>
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
