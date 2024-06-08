export type DayType = '월' | '화' | '수' | '목' | '금' | '토' | '일';
export default function DayIcon({ day }: { day: DayType | undefined }) {
    return (
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-[0.5px] border-neutral-400">
            <div className="absolute text-sm font-normal leading-[21px] text-neutral-400">{day}</div>
        </div>
    );
}
