import React from 'react';
import { getUserDetails } from '../utils/UserRequests';
import withAuthSetUp from '../hocs/withAuthSetUp';

const Homepage = () => {
    React.useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div></div>
    )
}

export default withAuthSetUp(Homepage);