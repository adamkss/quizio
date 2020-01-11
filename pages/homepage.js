import React from 'react';
import withAuthSetUp from '../hocs/withAuthSetUp';
import { QuizzesLayoutWrapper } from '../components/quizzes/QuizzesLayoutWrapper';
import { QuizioIllustration } from '../components/visual/QuizioIllustration';
import PrimaryButton from '../components/PrimaryButton';
import GenericDailog from '../components/GenericDailog';
import Router from 'next/router';

const Homepage = ({ currentUserDetails }) => {
    const [quizToContinueWorkingOn, setQuizToContinueWorkingOn] = React.useState({ genericQuizName: 'asd' });

    React.useEffect(() => {
        const quizToContinueOnWorking = sessionStorage.getItem('quizToContinueOnWorking');
        if (quizToContinueOnWorking) {
            setQuizToContinueWorkingOn(JSON.parse(quizToContinueOnWorking));
            sessionStorage.removeItem('quizToContinueOnWorking');
        }
    }, [setQuizToContinueWorkingOn]);

    const onAbandonContinueAnonymousQuiz = React.useCallback(() => {
        setQuizToContinueWorkingOn(null);
    }, []);

    const onContinueWithAbandonedQuiz = React.useCallback(() => {
        Router.push(`/genericQuizzes/${quizToContinueWorkingOn.genericQuizId}/editor`);
    }, [Router, quizToContinueWorkingOn]);

    return (
        <>
            <QuizzesLayoutWrapper>
                <main>
                    <h1>Welcome, <span>{currentUserDetails.name}</span>.</h1>
                    <QuizioIllustration />
                    <PrimaryButton title="Go to my quizzes" color="pink" linkTo="/quizzes" big centered />
                </main>
                {quizToContinueWorkingOn ?
                    <GenericDailog title="Continue editing your quiz?" onDismissDialog={onAbandonContinueAnonymousQuiz}>
                        <p className="continue-editing__text">Continue editing quiz "<span>{quizToContinueWorkingOn.genericQuizName}</span>" ?</p>
                        <div className="horizontally-end-positioned">
                            <PrimaryButton
                                title="Continue"
                                marginTop
                                marginRight
                                color="blue"
                                onClick={onContinueWithAbandonedQuiz}
                                medium />
                            <PrimaryButton
                                medium
                                secondary
                                marginTop
                                onClick={onAbandonContinueAnonymousQuiz}
                                title="Later" />
                        </div>
                    </GenericDailog>
                    :
                    ''}
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
                    .continue-editing__text {
                        font-size: 1.3rem;
                        font-weight: 300;
                    }
                    .continue-editing__text > span {
                        font-weight: 500;
                        font-size: 1.5rem;
                    }
                `}
            </style>
        </>
    )
}

export default withAuthSetUp(Homepage);