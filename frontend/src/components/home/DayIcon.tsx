// TODO undefined 처리
export default function DayIcon({ day }: { day: string | undefined }) {
    return (
        <div className="flex justify-center items-center border-[0.5px] rounded-full w-[30px] h-[30px] border-neutral-400">
            <div className="absolute text-neutral-400 text-sm font-normal leading-[21px]">{day}</div>
        </div>
    );
}
