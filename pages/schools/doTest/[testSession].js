import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { getNumberOfQuestions } from "../../../utils/TestRequests";
import { executeAsyncFunctionAndObserveState } from "../../../utils/AsyncUtils";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LayoutSetup from "../../../components/layoutSetup";

export default () => {
    const { testSession } = useRouter().query;
    const [numberOfQuestions, setNumberOfQuestions] = useState(null);
    const [isLoadingScreenShown, setIsLoadingScreenShown] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [currentQuestionOrderNr, setCurrentQuestionOrderNr] = useState(1);

    useEffect(() => {
        (async () => {
            if (testSession) {
                const nrOfQuestions = await executeAsyncFunctionAndObserveState(
                    setIsLoadingScreenShown,
                    getNumberOfQuestions,
                    testSession
                );
                setNumberOfQuestions(nrOfQuestions);
            }
        })();
    }, [testSession]);

    return (
        <>
            <LayoutSetup />
            {isLoadingScreenShown ?
                <LoadingSpinner />
                :
                ""
            }
            <main>
                <div className="layout-organizer">
                    <section className="questions-list">
                        <QuestionsList />
                    </section>
                    <div className="horizontally-centered question-grid">
                        <div className="question-container">
                            {currentQuestion ?
                                <Question
                                    question="1. How are you called?"
                                    options={[
                                        {
                                            id: 1,
                                            title: "unu"
                                        }, {
                                            id: 2,
                                            title: "doi"
                                        }
                                    ]} />

                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </main>
            <style jsx>
                {`
                    main {
                        width: 100%;
                        height: 100vh;
                    }
                    .layout-organizer {
                        height: 100%;
                        display: grid;
                        padding: 50px;
                        grid-template-columns: 1fr 5fr;
                    }
                    .questions-list {
                        align-self: end;
                        padding-bottom: 40px;
                    }
                    .question-container {
                        width: 60vw;
                        min-width: 400px;
                        display: flex;
                        justify-content: center;
                        padding-top: 50px;
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

const QuestionsList = ({ numberOfQuestions = 23, currentQuestionOrderNr = 1 }) => {
    return (
        <>
            <div className="layout">
                {[...Array(numberOfQuestions)].map((el, index) => {
                    const extraCSS = index + 1 == currentQuestionOrderNr ? " current" : "";
                    return (
                        <div className={`element${extraCSS}`} title={`Go to question ${index + 1}`}>
                            <span className="element-text">{index + 1}</span>
                        </div>
                    )
                }
                )}
            </div>
            <style jsx>
                {`
                .layout {
                  display: grid;
                  gap: 5px;
                  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
                  place-items: center;
                  align-content: start;
                }
                .element {
                    width: 35px;
                    height: 35px;
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 15px;
                    position: relative;
                    opacity: 0.7;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .element.current {
                    background-color: rgba(0,0,0,0.2);
                }
                .element:hover,
                .element:active,
                .element.current {
                    opacity:1;
                }
                .element-text {
                    display: block;
                    text-align: center;
                    vertical-align: middle;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            `}
            </style>
        </>
    )
}