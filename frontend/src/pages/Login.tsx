import OAuthButton from '@/components/OAuthButton';
import { OAUTH } from '@/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import signupIn3secs from '@/assets/icons/ic-signup-asap.svg';
import cancel from '@/assets/icons/ic-top-cancel.svg';
const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const prevURL = location.state.redirectURI;
    return (
        <div className="flex flex-col justify-center">
            <div className="flex justify-end items-center mb-[1.3125rem]">
                <div className="flex w-12 h-12 relative flex-col justify-start items-start translate-x-3">
                    <button onClick={() => navigate(-1)}>
                        <img src={cancel} alt="cancel" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-center bg-zinc-300 mx-10 mb-10 h-[11.25rem] items-center">
                <p className="mx-5">로고나 간단한 서비스 소개문구 넣으면 좋을 것 같아요</p>
            </div>

            <div className="flex flex-col gap-2 justify-center">
                <div className="flex relative justify-center items-center mx-[4.375rem]">
                    <img className="" src={signupIn3secs} alt="빠른가입 안내" />
                    <p className="absolute text-center text-black font-semibold text-sm leading-[1.3rem]">
                        ⚡️3초만에 빠른 회원가입
                    </p>
                </div>

                <div className="flex flex-col items-center gap-2 mx-[0.625rem]">
                    {OAUTH.map((oauth, index) => (
                        <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} prevURL={prevURL} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
