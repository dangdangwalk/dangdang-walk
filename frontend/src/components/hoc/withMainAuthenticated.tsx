/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import Spinner from '@/components/commons/Spinner';
import { useAuth } from '@/hooks/useAuth';
import React, { ComponentType, useEffect } from 'react';

export const withMainAuthenticated = (Component: ComponentType): React.FC => {
    return () => {
        const {
            refreshTokenQuery: { isPending },
        } = useAuth();

        useEffect(() => {
            window.onpageshow = function (event) {
                if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
                    window.location.reload();
                }
            };
        }, []);

        if (isPending) {
            return <Spinner className="absolute z-40 bg-neutral-800/40" />;
        }

        return <Component />;
    };
};
