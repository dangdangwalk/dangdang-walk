/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/hooks/useAuth';
import React, { ComponentType, useEffect } from 'react';

export const withMainAuthenticated = (Component: ComponentType): React.FC => {
    return () => {
        useAuth();

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
