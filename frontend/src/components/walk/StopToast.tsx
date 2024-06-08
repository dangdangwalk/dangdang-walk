import Touch from '@/assets/icons/ic-touch.svg';

export default function StopToast({ isVisible }: { isVisible: boolean }) {
    return (
        <div
            role="alert"
            className={`absolute bottom-24 left-1/2 z-50 flex h-14 w-[213px] -translate-x-1/2 items-center justify-between rounded-2xl bg-white px-[18px] shadow transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="text-xs font-semibold leading-[18px] text-neutral-800">
                정지 버튼을 길게 누르면
                <br />
                산책이 종료됩니다
            </div>
            <img className="size-9" src={Touch} alt="길게눌러주세요 터치" />
        </div>
    );
}
