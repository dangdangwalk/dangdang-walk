import { useToastStore } from '@/store/toastStore';

function Toast() {
    const isShowing = useToastStore((state) => state.isShowing);
    const text = useToastStore((state) => state.text);

    return (
        <>
            {isShowing ? (
                <div className="fixed top-1/2 z-[100] max-h-screen w-full animate-fadeOut text-center">
                    <span className="rounded-[20px] bg-neutral-800 px-[30px] py-2 font-['Pretendard'] text-sm font-medium text-white opacity-60">
                        {text}
                    </span>
                </div>
            ) : null}
        </>
    );
}

export { Toast };
