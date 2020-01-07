import { useState, useEffect, useCallback } from 'react';
import LayoutSetup from '../../components/layoutSetup';
import { getNextQuizQuestion, verifyAnswer } from '../../utils/QuizRequests';
import Router, { useRouter } from 'next/router';
import PrimaryButton from '../../components/PrimaryButton';

export default ({ }) => {
    const router = useRouter();
    const { sessionId } = router.query;

    const [progress, setProgress] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [nextQuestionAvailable, setNextQuestionAvailable] = useState(false);
    const [currentlySelectedAnswerOrderNr, setCurrentlySelectedAnswerOrderNr] = useState(null);
    const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

    const getAndSetNextQuizQuestion = async (shouldISetProgress) => {
        const { data: { question, done, progress } } = await getNextQuizQuestion(sessionId);
        if (done) {
            window.localStorage.setItem('sessionId', sessionId);
            Router.push('/quiz/done');
        }
        setCurrentQuestion(question);
        shouldISetProgress ? setProgress(progress) : null;
    }

    //TODO: This loads the first question from the server
    useEffect(() => {
        if (sessionId)
            getAndSetNextQuizQuestion(true);
    }, [sessionId]);

    const onAnswerSelected = useCallback(async (selectedAnswerOrderNr) => {
        const { data: { valid, progress } } = await verifyAnswer(sessionId, currentQuestion.id, selectedAnswerOrderNr);
        setCurrentlySelectedAnswerOrderNr(selectedAnswerOrderNr);
        setIsCurrentAnswerCorrect(valid);
        if (valid) {
            setProgress(progress);
        }
        setNextQuestionAvailable(true);
    }, [currentQuestion, sessionId]);

    const onNextPressed = () => {
        setNextQuestionAvailable(false);
        setCurrentlySelectedAnswerOrderNr(null);
        setIsCurrentAnswerCorrect(false);
        getAndSetNextQuizQuestion();
    }

    return (
        <>
            <LayoutSetup />
            <div className="outer">
                <header>
                    <div className="progress-container">
                        <ProgressBar progress={progress} />
                    </div>
                </header>
                <main>
                    <div className="question-container">
                        {currentQuestion ?
                            <Question
                                question={currentQuestion.question}
                                options={currentQuestion.questionOptions}
                                onAnswerSelected={onAnswerSelected}
                                currentlySelectedAnswerOrderNr={currentlySelectedAnswerOrderNr}
                                isSelectedAnswerCorrect={isCurrentAnswerCorrect}
                            />
                            :
                            null
                        }
                    </div>
                </main>
                <footer>
                    {currentlySelectedAnswerOrderNr != null ?
                        <AnswerFooter isItCorrect={isCurrentAnswerCorrect} onNextPressed={onNextPressed} />
                        : ""}
                </footer>
            </div>
            <style jsx>
                {`
                    .outer {
                        padding: 20px;
                        position: relative;
                    }
                    header {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .progress-container {
                        width: 100%;
                        max-width: 1200px;
                    }
                    main {
                        width: 100%;
                        height: calc(100vh - 40px);
                        overflow-y: auto;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        padding-bottom: 50px;
                    }
                    .question-container {
                        width: 100%;
                        max-width: 1200px;
                        padding: 10px;
                    }
                `}
            </style>
        </>
    )
}

const ProgressBar = ({ progress }) => {
    const clipPathPercentage = progress != 0 ? progress : 2;

    return (
        <>
            <div className="shell">
                <div className="progress"></div>
            </div>
            <style jsx>
                {`
                .shell {
                    width: 100%;
                    height: 20px;
                    border-radius: 12px;
                    box-shadow: 0px 0px 10px grey;
                    display: flex;
                    align-items:center;
                    padding: 2px;
                }

                .progress {
                    width: 100%;
                    height: 18px;
                    border-radius: 12px;
                    ${progress > 0 && progress < 99 ?
                        "border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                        :
                        ""
                    }
                    background: linear-gradient(
                        90deg,
                        #6f36bc 20%,
                        #ff4778 95%
                    );
                    clip-path: polygon(0 0, ${clipPathPercentage}% 0, ${clipPathPercentage}% 100%, 0% 100%);
                    box-shadow: inset 0 2px 9px  rgba(255,255,255,0.3);
                    transition: all 0.5s ease-out;
                }
                `}
            </style>
        </>
    )
}

const Question = ({ question, options = [], onAnswerSelected, currentlySelectedAnswerOrderNr, isSelectedAnswerCorrect }) => {
    return (
        <>
            <div className="outer-container">
                <span className="question">{question}</span>
                {options.map((option, index) => {
                    const extraClassNames = currentlySelectedAnswerOrderNr != null ?
                        index === currentlySelectedAnswerOrderNr ?
                            isSelectedAnswerCorrect ? "correct-answer" : "incorrect-answer"
                            : "inactive"
                        : "";

                    return (
                        <div className={`option ${extraClassNames}`} key={option.id} onClick={() => !currentlySelectedAnswerOrderNr ? onAnswerSelected(index) : ""}>
                            <span className="nr">{index + 1}.</span>
                            <span className="answer">
                                {option.title}
                            </span>
                        </div>
                    )
                })}
            </div>
            <style jsx>
                {`
                    .outer-container {
                        width: 100%;
                        display:flex;
                        flex-direction: column;
                    }
                    span.question {
                        font-family: 'Oswald', sans-serif;
                        font-size: 2.5em;
                        margin-bottom: 30px;
                    }
                    .option {
                        width: 100%;
                        max-width: 700px;
                        box-shadow: 0px 0px 3px grey;
                        border-radius: 5px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease-out;
                        font-weight: 300;
                        font-size: 1.5em;
                    }

                    .option.correct-answer {
                        box-shadow: 0px 0px 12px green;
                        background-color: #4bac61;
                        color: white;
                    }

                    .option.incorrect-answer {
                        box-shadow: 0px 0px 12px red;
                        background-color: #ba2232;
                        color: white;
                    }

                    .option:not(.correct-answer):not(.inactive):hover {
                        box-shadow: 0px 0px 12px grey;
                    }

                    .option.inactive {
                        background-color: rgba(0, 0, 0, 0.1);
                        color: rgba(0, 0, 0, 0.4);
                        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
                        cursor: not-allowed;
                    }

                    .option > .nr {
                        margin-right: 8px;
                    }

                    .option:not(:last-child) {
                        margin-bottom: 20px;
                    }
                `}
            </style>
        </>
    )
}

const AnswerFooter = ({ isItCorrect, onNextPressed }) => {
    return (
        <>
            <div className="outer">
                <div className="information">
                    <div className="text">
                        {
                            isItCorrect ?
                                <>
                                    <span className="title">Great!</span>
                                    <span className="subtitle">You answered correctly :)</span>
                                </>
                                :
                                <>
                                    <span className="title">Oopsie :(</span>
                                    <span className="subtitle">That is not correct. You'll get it next time!</span>
                                </>
                        }
                    </div>
                    <div className="next-button-container">
                        <div className="next-button">
                            <PrimaryButton onClick={onNextPressed} containerWidthAndHeight title="Next" color="blue" marginTop />
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
            .outer {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                height: 150px;
                //background-color: ${isItCorrect ? "#4bac61" : "#ba2232"};
                background-color: white;
                animation: SlideUp 0.3s ease-out;
                box-shadow: 0px 0px 8px grey;
            }
            @keyframes SlideUp {
                0% {
                    bottom: -100px;
                }
                100% {
                    bottom: 0;
                }
            }
            .information {
                position: absolute;
                width: 100%;
                padding-left: 4%;
                padding-right: 4%;
                padding-top: 12px;
                padding-bottom: 12px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                color: black;
            }
            .next-button-container {
                display: flex;
                justify-content: flex-end;
            }
            .next-button {
                width: 110px;
                height: 45px;
                font-size: 1.2em;
            }
            @media (min-width: 473px) {
                .next-button {
                    width: 120px;
                    height: 50px;
                    font-size: 1.3em;
                }
            }
            @media (min-width: 880px) {
                .information {
                    flex-direction: row;
                    align-items: center;
                }
                .next-button-container {
                    display: block;
                }
                .next-button {
                    width: 140px;
                    height: 65px;
                    font-size: 1.3em;
                }
            }
            @media (min-width: 690px) {
                .information {
                    font-size: 1.1em;
                }
            }
            @media (min-width: 920px) {
                .information {
                    font-size: 1.2em;
                }
            }
            @media (min-width: 1499px) {
                .information {
                    font-size: 1.3em;
                }
            }
            .information .text {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
            .information .title {
                font-size: 1.4em;
                font-weight: 500;
            }
            .information .subtitle {
                font-size: 1.2em;
                font-weight: 300;
            }
            `}
            </style>
        </>
    )
}