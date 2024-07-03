/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import React, { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

export const withAuthenticated = (Component: ComponentType): React.FC => {
    return () => {
        const {
            refreshTokenQuery: { isLoading, isSuccess },
        } = useAuth();

        const isSignedIn = useStore((state) => state.isSignedIn);
        const spinnerAdd = useStore((state) => state.spinnerAdd);
        const spinnerRemove = useStore((state) => state.spinnerRemove);

        const navigate = useNavigate();

        if (!isSignedIn) {
            navigate('/');
            return null;
        }
        isLoading ? spinnerAdd() : spinnerRemove();

        if (isSuccess) return <Component />;

        return <Component />;
    };
};
