import React from 'react';

type Props = {
    provider: string;
    name: string;
    prevURL: string;
};
const OAuthButton = ({ provider, name, prevURL }: Props) => {
    const handleCallOAuth = () => {
        window.location.href = `${process.env.REACT_APP_NEST_BASE_URL}/auth/${provider}?redirect=${process.env.REACT_APP_BASE_URL}${prevURL}`;
    };
    return (
        <button className="bg-yellow-200" onClick={handleCallOAuth}>
            {name} 로그인하기
        </button>
    );
};

export default OAuthButton;
