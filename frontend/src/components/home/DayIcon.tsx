import Ellipse from '@/assets/icons/walk/ellipse-108.svg';

// TODO undefined 처리
export default function DayIcon({ day }: { day: string | undefined }) {
    return (
        <div className="relative flex justify-center items-center">
            <img src={Ellipse} alt="eliipse" />
            <div className="absolute text-neutral-400 text-sm font-normal leading-[21px]">{day}</div>
        </div>
    );
}
