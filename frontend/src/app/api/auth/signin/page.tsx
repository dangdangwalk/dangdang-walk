import { getProviders } from 'next-auth/react';
import React from 'react';
import Signin from './components/Signin';

export default async function SigninPage() {
    const providers = (await getProviders()) ?? {};
    //로그인 후 원래 접근하려던 페이지로 리다이렉트할 callbackUrl 설정
    return <Signin providers={providers} callbackUrl="/" />;
}
