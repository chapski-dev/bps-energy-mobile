import React, { useEffect } from 'react';

import { navigationRef } from '@src/navigation/navigationRef';
import { AuthState, useAuth } from '@src/providers/auth';

export const withProtectedScreen = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  return props => {
    const { authState } = useAuth();

    useEffect(() => {
      if (authState !== AuthState.ready) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'login' }]
        })
      }
    }, [authState]);

    if (authState !== AuthState.ready) return null;

    return <WrappedComponent {...props} />;
  };
};
