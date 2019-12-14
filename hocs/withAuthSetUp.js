import React from 'react';
import useAuthTokenIfExists from '../hooks/useAuthTokenIfExists';
import LoadingSpinner from '../components/LoadingSpinner';

export default (WrappedComponent) => {
    return (props) => {
        const authSetUp = useAuthTokenIfExists({ redirectURLIfDoesNotExist: "/login" });
        return (
            <>
                {authSetUp ?
                    <WrappedComponent {...props} />
                    :
                    <LoadingSpinner />
                }
            </>
        )
    }
}