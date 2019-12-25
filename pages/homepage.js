import React from 'react';
import withAuthSetUp from '../hocs/withAuthSetUp';
import {QuizzesLayoutWrapper} from '../components/quizzes/QuizzesLayoutWrapper';

const Homepage = () => {
    React.useEffect(() => {
    }, []);

    return (
        <QuizzesLayoutWrapper>
            
        </QuizzesLayoutWrapper>
    )
}

export default withAuthSetUp(Homepage);