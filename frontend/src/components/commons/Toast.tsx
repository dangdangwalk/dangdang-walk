import { useStore } from '@/store';

function Toast() {
    const isShowing = useStore((state) => state.isShowing);
    const text = useStore((state) => state.text);

    return (
        <>
            {isShowing ? (
                <div className="fixed top-1/2 z-[100] max-h-screen w-dvw animate-fadeOut text-center sm:w-[640px]">
                    <span className="rounded-[20px] bg-neutral-800 px-[30px] py-2 font-['Pretendard'] text-sm font-medium text-white opacity-60">
                        {text}
                    </span>
                </div>
            ) : null}
        </>
    );
}

export { Toast };
