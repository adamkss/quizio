import React from 'react';
import withAuthSetUp from '../hocs/withAuthSetUp';
import { QuizzesLayoutWrapper } from '../components/quizzes/QuizzesLayoutWrapper';
import PrimaryButton from '../components/PrimaryButton';
import GenericDailog from '../components/GenericDailog';
import Router from 'next/router';
import { SillyHandwritingWithOption } from '../components/visual/SillyHandwriting';

const Homepage = ({ currentUserDetails }) => {
    const [quizToContinueWorkingOn, setQuizToContinueWorkingOn] = React.useState(null);

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

    const onQuizzesTileClick = React.useCallback(() => {
        Router.push('/quizzes');
    }, [Router]);

    const onTestsTileClick = React.useCallback(() => {
        Router.push('/schools/tests');
    }, [Router]);
    return (
        <>
            <QuizzesLayoutWrapper>
                <main>
                    <h1>Welcome, <span>{currentUserDetails.name}</span>.</h1>
                    <section className="tiles-container fade-and-slide-in">
                        <div className="tile quizzes-tile" onClick={onQuizzesTileClick}>
                            <p className="tile__text">Manage my <span className="tile-text__bold">quizzes</span></p>
                            <QuizIllustration />
                        </div>
                        <div className="tile tests-tile" onClick={onTestsTileClick}>
                            <p className="tile__text">Manage my <span className="tile-text__bold">tests</span></p>
                            <TestIllustration />
                        </div>
                    </section>
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
                    .tiles-container {
                        display: flex;
                        justify-content: center;
                        margin-top: 40px;
                        flex-wrap: wrap;
                    }
                    .tile {
                        width: 400px;
                        height: 450px;
                        border-radius: 8px;
                        margin: 20px;
                        overflow: hidden;
                        padding: 20px;
                        transition: all 0.3s;
                        cursor: pointer;
                    }
                    .quizzes-tile {
                        background-color: #1976D2;
                        box-shadow: 0px 0px 10px #1976D2;
                    }
                    .tests-tile {
                        background-color: #6a1b9a;
                        box-shadow: 0px 0px 10px #6a1b9a;
                    }
                    .quizzes-tile:hover {
                        background-color: hsl(210,79%,53%);
                    }
                    .tests-tile:hover {
                        background-color: hsl(277,70%,43%);
                    }
                    .tile__text {
                        font-size: 2.2rem;
                        font-weight: 600;
                        color: white;
                        text-align: center;
                        font-weight: 200;
                    }
                    .tile-text__bold {
                        font-weight: 600;
                    }
                    .tile__img {
                        width: 300px;
                        margin-top: 50px;
                        box-shadow: 0px 0px 8px white;
                    }
                `}
            </style>
        </>
    )
}

export default withAuthSetUp(Homepage);

const QuizIllustration = () => {
    return (
        <>
            <div className="shell">
                <h1>When did we first meet?</h1>
                <SillyHandwritingWithOption text="In 1997" />
                <SillyHandwritingWithOption text="In the library" checked />
                <SillyHandwritingWithOption text="First class" />
            </div>
            <style jsx>
                {`
                    .shell {
                        width: 100%;
                        max-width: 300px;
                        box-shadow: 2px 2px 13px rgba(0,0,0,0.2);
                        border-radius: 5px;
                        padding: 30px;
                        padding-top: 20px;
                        background-color: white;
                        transform: scale(0.8) rotate(4deg) translate(40px, -25px);
                    }
                    @media (min-width: 750px) {
                        .shell {
                            max-width: 400px;
                        }
                    }
                    @media (min-width: 1400px) {
                        .shell {
                            max-width: 400px;
                        }
                    }
                    @media (min-width: 1600px) {
                        .shell {
                        }
                    }
                    @media (min-width: 1800px) {
                        .shell {
                        }
                    }
                    h1 {
                        text-align: center;
                        font-weight: 400;
                        font-size: 2em;
                    }
            `}
            </style>
        </>
    )
}

const TestIllustration = () => {
    return (
        <>
            <div className="shell">
                <h1>How's PI going?</h1>
                <SillyHandwritingWithOption smallMargin text="3.1416" width={"30px"} />
                <SillyHandwritingWithOption smallMargin text="1.55434" width={"30px"} />
                <SillyHandwritingWithOption smallMargin text="3.1415" checked width={"30px"} />
            </div>
            <style jsx>
                {`
                    .shell {
                        width: 350px;
                        box-shadow: 2px 2px 13px rgba(0,0,0,0.2);
                        border-radius: 5px;
                        padding: 30px;
                        padding-top: 20px;
                        background-color: white;
                        transform: rotate(4deg);
                        font-size: 0.8rem;
                        margin-top: 40px;
                    }
                    h1 {
                        text-align: center;
                        font-weight: 400;
                        font-size: 2em;
                    }
            `}
            </style>
        </>
    )
}