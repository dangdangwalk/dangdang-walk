import Touch from '@/assets/icons/walk/touch.svg';

export default function StopToast({ isShow }: { isShow: boolean }) {
    return (
        <div
            className={`w-[213px] h-14 px-[18px] bg-white rounded-2xl shadow  absolute left-1/2 -translate-x-1/2 bottom-24 z-50 flex justify-between items-center ${isShow ? 'visible' : 'hidden'}`}
        >
            <div className=" text-neutral-800 text-xs font-semibold leading-[18px]">
                정지 버튼을 길게 누르면
                <br />
                산책이 종료됩니다
            </div>
            <img className="w-9 h-9" src={Touch} alt="길게눌러주세요 터치" />
        </div>
    );
}
