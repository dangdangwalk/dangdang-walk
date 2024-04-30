import React from 'react';

type Props = {
    provider: string;
    name: string;
};
const OAuthButton = ({ provider, name }: Props) => {
    const handleCallOAuth = () => {
        window.location.href = `${process.env.REACT_APP_NEST_BASE_URL}/auth/${provider}`;
    };
    return (
        <button className="bg-yellow-200" onClick={handleCallOAuth}>
            {name} 로그인하기
        </button>
    );
};

export default OAuthButton;
