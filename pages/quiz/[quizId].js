import { useState, useEffect, useCallback } from 'react';
import LayoutSetup from '../../components/layoutSetup';
import { getNextQuizQuestion, verifyAnswer } from '../../utils/QuizRequests';
import Router, { useRouter } from 'next/router';

export default ({ }) => {
    const router = useRouter();
    const { quizId } = router.query;

    const [progress, setProgress] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [nextQuestionAvailable, setNextQuestionAvailable] = useState(false);
    const [currentlySelectedAnswerId, setCurrentlySelectedAnswerId] = useState(null);
    const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

    const getAndSetNextQuizQuestion = async () => {
        const { data: { question, done } } = await getNextQuizQuestion(quizId);
        if (done) {
            Router.push('/quiz/done');
        }
        setCurrentQuestion(question);
    }

    //TODO: This loads the first question from the server
    useEffect(() => {
        if (quizId)
            getAndSetNextQuizQuestion();
    }, [quizId]);

    const onAnswerSelected = useCallback(async (selectedAnswerId) => {
        setCurrentlySelectedAnswerId(selectedAnswerId);
        const { data: { valid, progress: progressUnit } } = await verifyAnswer(quizId, currentQuestion.id, selectedAnswerId);
        setIsCurrentAnswerCorrect(valid);
        if (valid) {
            setProgress((progress) => {
                const totalProgress = progress + progressUnit;
                return totalProgress > 99 ? 100 : totalProgress;
            });
        }
        setNextQuestionAvailable(true);
    }, [currentQuestion, quizId]);

    const onNextPressed = () => {
        setNextQuestionAvailable(false);
        setCurrentlySelectedAnswerId(null);
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
                                options={currentQuestion.options}
                                onAnswerSelected={onAnswerSelected}
                                currentlySelectedAnswerId={currentlySelectedAnswerId}
                                isSelectedAnswerCorrect={isCurrentAnswerCorrect}
                            />
                            :
                            null
                        }
                    </div>
                    <div className="button-container">
                        <button
                            className={`go-forward${nextQuestionAvailable ? " active" : ""}`}
                            onClick={onNextPressed}>
                            Next
                        </button>
                    </div>
                </main>
                <footer>
                    {currentlySelectedAnswerId ?
                        <AnswerFooter isItCorrect={isCurrentAnswerCorrect} />
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
                        min-width: 700px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .progress-container {
                        width: 70%;
                        min-width: 700px;
                    }
                    .question-container {
                        width: 70%;
                        min-width: 700px;
                    }
                    main {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                    }
                    .button-container {
                        width:70%;
                        display: flex;
                        flex-direction: row-reverse;
                        padding-top: 50px;
                    }
                    button.go-forward {
                        width: 150px;
                        height: 50px;
                        cursor: pointer;
                        outline: none;
                        border: none;
                        border-radius: 10px;
                        font-family: Oswald;
                        font-size: 1.3em;
                        background-color: rgba(0, 0, 0, 0.2);
                        color: grey;
                        box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s;
                    }
                    button.go-forward.active {
                        background-color: #ED4D8B;
                        color: white;
                        box-shadow: 1px 1px 10px #ED4D8B;
                    }

                    button.go-forward.active:hover {
                        box-shadow: 1px 1px 15px #ED4D8B;
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
                    padding: 2px;
                }

                .progress {
                    width: 100%;
                    height: 20px;
                    border-radius: 12px;
                    ${progress > 0 && progress < 100 ?
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

const Question = ({ question, options = [], onAnswerSelected, currentlySelectedAnswerId, isSelectedAnswerCorrect }) => {
    return (
        <>
            <div className="outer-container">
                <span className="question">{question}</span>
                {options.map((option, index) => {
                    // const extraClassNames = option.id === currentlySelectedAnswerId ?
                    //     isSelectedAnswerCorrect ? "correct-answer" : "incorrect-answer"
                    //     : "";

                    const extraClassNames = currentlySelectedAnswerId ?
                        option.id === currentlySelectedAnswerId ?
                            isSelectedAnswerCorrect ? "correct-answer" : "incorrect-answer"
                            : "inactive"
                        : "";

                    return (
                        <div className={`option ${extraClassNames}`} key={option.id} onClick={() => !currentlySelectedAnswerId ? onAnswerSelected(option.id) : ""}>
                            <span className="nr">{index + 1}.</span>
                            <span className="answer">
                                {option.answer}
                            </span>
                        </div>
                    )
                })}
            </div>
            <style jsx>
                {`
                    .outer-container {
                        width: 100%;
                        padding-top: 100px;
                        display:flex;
                        flex-direction: column;
                    }
                    span.question {
                        font-family: 'Oswald', sans-serif;
                        font-size: 2.5em;
                        margin-bottom: 30px;
                    }
                    .option {
                        width: 500px;
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

const AnswerFooter = ({ isItCorrect }) => {
    return (
        <>
            <div className="outer">
                <div className="information">
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
            </div>
            <style jsx>
                {`
            .outer {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                height: 100px;
                background-color: ${isItCorrect ? "#4bac61" : "#ba2232"};
                animation: SlideUp 0.3s ease-out;
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
                left: 18%;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                color: white;
            }
            .information > .title {
                font-size: 1.4em;
                font-weight: 500;
            }
            .information > .subtitle {
                font-size: 1.2em;
                font-weight: 300;
            }
            `}
            </style>
        </>
    )
}