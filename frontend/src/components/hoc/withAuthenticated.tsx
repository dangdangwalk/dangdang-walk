/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import React, { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

export const withAuthenticated = (Component: ComponentType): React.FC => {
    return () => {
        const isSignedIn = useStore((state) => state.isSignedIn);

        const {
            refreshTokenQuery: { isSuccess },
        } = useAuth();

        const navigate = useNavigate();

        if (!isSuccess) {
            navigate('/');
            return <></>;
        }

        return isSuccess && isSignedIn && <Component />;
    };
};
