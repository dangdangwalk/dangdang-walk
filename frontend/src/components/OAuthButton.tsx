import icGoogle from '@/assets/icons/ic-google.svg';
import icKakao from '@/assets/icons/ic-kakao.svg';
import icNaver from '@/assets/icons/ic-naver.svg';
import { storageKeys } from '@/constants';
import { useStore } from '@/store';
import { getAuthorizeCodeCallbackUrl } from '@/utils/oauth';
import { setStorage } from '@/utils/storage';

type Props = {
    provider: string;
    name: string;
};
const OAuthButton = ({ provider, name }: Props) => {
    const setLoginBottomSheetState = useStore((state) => state.setLoginBottomSheetState);
    const btnLogin = (provider: string) => {
        switch (provider) {
            case 'google':
                return icGoogle;
            case 'kakao':
                return icKakao;
            case 'naver':
                return icNaver;
            default:
                return;
        }
    };
    const bgColor = (provider: string) => {
        switch (provider) {
            case 'google':
                return 'bg-google';
            case 'kakao':
                return 'bg-kakao';
            case 'naver':
                return 'bg-naver';
            default:
                return;
        }
    };
    const handleCallOAuth = (provider: string) => {
        setStorage(storageKeys.PROVIDER, provider);
        setStorage(storageKeys.REDIRECT_URI, window.location.pathname);
        let url = getAuthorizeCodeCallbackUrl(provider);
        window.location.href = url;
    };
    return (
        <button
            className={`relative flex h-[3.25rem] w-full items-center justify-center rounded-lg duration-100 active:scale-[0.97] ${bgColor(
                provider
            )} ${provider === 'google' && 'border border-neutral-200'}`}
            onClick={() => {
                setLoginBottomSheetState(false);
                setTimeout(() => {
                    handleCallOAuth(provider);
                }, 100);
            }}
        >
            <img className="absolute left-0 ml-5" src={btnLogin(provider)} alt={`${provider}`} />
            <div
                className={`my-auto text-center font-roboto text-base font-bold leading-normal ${
                    provider === 'kakao' && 'text-opacity-85'
                } ${provider === 'naver' ? 'text-white' : 'text-black'}`}
            >
                {name}로 시작하기
            </div>
        </button>
    );
};

export default OAuthButton;
