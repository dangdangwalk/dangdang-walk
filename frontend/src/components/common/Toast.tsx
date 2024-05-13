import { useToastStore } from '@/store/toastStore';

function Toast() {
    const isShowing = useToastStore((state) => state.isShowing);
    const text = useToastStore((state) => state.text);

    return (
        <>
            {isShowing ? (
                <div className="fixed top-1/2 z-[100] max-h-screen w-full text-center">
                    <span className="px-[30px] py-2 bg-neutral-800 opacity-60 text-white rounded-[20px] text-sm font-medium font-['Pretendard']">
                        {text}
                    </span>
                </div>
            ) : null}
        </>
    );
}

export { Toast };
