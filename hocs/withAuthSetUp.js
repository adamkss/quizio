import React from 'react';
import useAuthTokenIfExists from '../hooks/useAuthTokenIfExists';
import LoadingSpinner from '../components/LoadingSpinner';

export default (WrappedComponent) => {
    return (props) => {
        const [authSetUp, currentUserDetails] =
            useAuthTokenIfExists({ redirectURLIfDoesNotExist: "/login" });
        return (
            <>
                {authSetUp ?
                    <WrappedComponent currentUserDetails={currentUserDetails} {...props} />
                    :
                    <LoadingSpinner />
                }
            </>
        )
    }
}