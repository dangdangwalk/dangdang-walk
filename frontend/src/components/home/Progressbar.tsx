export default function Progressbar({ percentage }: { percentage: number }) {
    return (
        <div className="relative h-4 w-[235px] rounded-md border border-neutral-200">
            <div
                className="absolute -left-px -top-px h-4 rounded-md border border-orange-300 bg-orange-300"
                style={percentage ? { width: `calc(${percentage > 100 ? 100 : percentage}% + 2px)` } : { border: 0 }}
            ></div>
        </div>
    );
}
