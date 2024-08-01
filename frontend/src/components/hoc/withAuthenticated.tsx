/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import Spinner from '@/components/commons/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import React, { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

export const withAuthenticated = (Component: ComponentType): React.FC => {
    return () => {
        const isSignedIn = useStore((state) => state.isSignedIn);

        if (isSignedIn) {
            return <Component />;
        }

        const {
            refreshTokenQuery: { isLoading, isSuccess },
        } = useAuth();

        const navigate = useNavigate();

        if (isLoading) {
            return <Spinner className="absolute z-40 bg-neutral-800/40" />;
        }
        if (!isSuccess) {
            navigate('/');
            return <></>;
        }

        return <Component />;
    };
};
