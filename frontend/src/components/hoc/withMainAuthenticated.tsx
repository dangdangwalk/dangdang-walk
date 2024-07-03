/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import React, { ComponentType, useEffect } from 'react';

export const withMainAuthenticated = (Component: ComponentType): React.FC => {
    return () => {
        const {
            refreshTokenQuery: { isLoading },
        } = useAuth();

        const spinnerAdd = useStore((state) => state.spinnerAdd);
        const spinnerRemove = useStore((state) => state.spinnerRemove);

        isLoading ? spinnerAdd() : spinnerRemove();

        useEffect(() => {
            window.onpageshow = function (event) {
                if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
                    window.location.reload();
                }
            };
        }, []);

        return <Component />;
    };
};
