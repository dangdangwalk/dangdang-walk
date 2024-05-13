import { useToastStore } from '@/store/toastStore';

function Toast() {
    const show = useToastStore((state) => state.isShowing);
    const text = useToastStore((state) => state.text);

    return (
        <>
            {show ? (
                <div className={`fixed top-1/2 z-[100] max-h-screen w-full text-center ${show ? '' : 'hidden'}`}>
                    <span className="px-[30px] py-2 bg-neutral-800 opacity-60 text-white rounded-[20px] text-sm font-medium font-['Pretendard']">
                        {text}
                    </span>
                </div>
            ) : null}
        </>
    );
}

export { Toast };
