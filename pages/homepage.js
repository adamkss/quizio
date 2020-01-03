import React from 'react';
import withAuthSetUp from '../hocs/withAuthSetUp';
import { QuizzesLayoutWrapper } from '../components/quizzes/QuizzesLayoutWrapper';
import { QuizioIllustration } from '../components/visual/QuizioIllustration';
import PrimaryButton from '../components/PrimaryButton';

const Homepage = ({ currentUserDetails }) => {

    return (
        <>
            <QuizzesLayoutWrapper>
                <main>
                    <h1>Welcome, <span>{currentUserDetails.name}</span>.</h1>
                    <QuizioIllustration />
                    <PrimaryButton title="Go to my quizzes" color="pink" linkTo="/quizzes" big centered />
                </main>
            </QuizzesLayoutWrapper>
            <style jsx>
                {`
                    main {
                        padding: 30px 0px;
                        width: 100%;
                    }
                    h1 {
                        font-weight: 300;
                        text-align: center;
                        font-size: 2.5em;
                    }
                    h1 span {
                        font-weight: 500;
                    }
                `}
            </style>
        </>
    )
}

export default withAuthSetUp(Homepage);