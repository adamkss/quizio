import { setupInitialToken } from '../utils/AxiosUtils';
import Router from 'next/router';
import React from 'react';
import { verifyIfTokenValid, clearToken } from '../utils/AuthUtils';

export default ({ redirectURLIfExists, redirectURLIfDoesNotExist } = {}) => {
    const [tokenExists, setTokenExists] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const isExisting = setupInitialToken();
            if (isExisting) {
                const isTokenValid = await verifyIfTokenValid();
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
        })();
    }, []);

    return tokenExists;
}