import { setupInitialToken } from '../utils/AxiosUtils';
import Router from 'next/router';
import React from 'react';
import { verifyIfTokenValid, clearToken, isSessionTimedOut } from '../utils/AuthUtils';
import { getUserDetails } from '../utils/UserRequests';

export default ({ redirectURLIfExists, redirectURLIfDoesNotExist } = {}) => {
    const [tokenExists, setTokenExists] = React.useState(false);
    const [currentUserDetails, setCurrentUserDetails] = React.useState(null);
    const [wasSessionTimedOut, setWasSessionTimedOut] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const isExisting = setupInitialToken();
            if (isExisting) {
                const isTokenValid = await verifyIfTokenValid();
                if (isTokenValid) {
                    const userDetails = await getUserDetails();
                    setCurrentUserDetails(userDetails);
                }
                setTokenExists(isTokenValid);
                if (isTokenValid && redirectURLIfExists)
                    Router.push(redirectURLIfExists);
                if (!isTokenValid) {
                    clearToken();
                    if (redirectURLIfDoesNotExist)
                        Router.push(redirectURLIfDoesNotExist);
                }
            } else {
                clearToken();
                if (redirectURLIfDoesNotExist)
                    Router.push(redirectURLIfDoesNotExist);
            }
            const wasSessionTimedOut = isSessionTimedOut();
            setWasSessionTimedOut(wasSessionTimedOut);
        })();
    }, []);
    return [tokenExists, currentUserDetails, wasSessionTimedOut];
}