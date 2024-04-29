import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from 'next-auth/providers/kakao';
import axios from 'axios';
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
                const { data } = await axios.post('http://localhost:3333/users/check-member', {
                    userId: account?.providerAccountId,
                });
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
