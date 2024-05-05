export default function Progressbar({ percentage }: { percentage: number }) {
    console.log(percentage);
    return (
        <div className="relative w-[235px] h-4 rounded-md border border-neutral-200">
            <div
                className="absolute left-[-1px] top-[-1px] h-4 border-orange-300 border  bg-orange-300  rounded-md"
                style={percentage ? { width: `calc(${percentage > 100 ? 100 : percentage}% + 2px)` } : { border: 0 }}
            ></div>
        </div>
    );
}
