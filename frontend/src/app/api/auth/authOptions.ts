import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from 'next-auth/providers/kakao';
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || '',
            clientSecret: process.env.NAVER_CLIENT_SECRET || '',
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID || '',
            clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    callbacks: {
        async signIn({ account }) {
            //백엔드 api
            try {
                const response = await fetch('http://localhost:3333/users/check-member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: account?.providerAccountId,
                    }),
                });

                if (!response.ok) {
                    // HTTP 상태 코드가 200이 아닌 경우 오류 처리
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('🎉🎉🎉🎉🎉backend data🎉🎉🎉🎉🎉 : ', data);
                return true;
            } catch (error) {
                console.error('error : ', error);
                return false;
            }
        },
        async jwt({ token }) {
            return token;
        },
        async session({ session }) {
            return session;
        },
    },
};
