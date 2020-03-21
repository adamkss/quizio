import { useRouter } from "next/router"
import { useEffect, useState, useCallback } from "react";
import { getSessionQuestionsWithIds, getQuestionDetails, getAllUnfinishedEntryCodesOfATest, getInfoAboutTestBySession } from "../../../utils/TestRequests";
import { executeAsyncFunctionAndObserveState } from "../../../utils/AsyncUtils";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PrimaryButton from "../../../components/PrimaryButton";
import LayoutSetup from "../../../components/layoutSetup";

export default () => {
    const { testSession } = useRouter().query;
    const [testInfo, setTestInfo] = useState(null);
    const [isLoadingScreenShown, setIsLoadingScreenShown] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionsWithIds, setQuestionsWithIds] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsState, setQuestionsState] = useState([]);
    //we use this state to cache already loaded questions
    const [preloadedQuestions, setPreloadedQuestions] = useState({});

    const loadQuestionInfo = useCallback(async (questionId) => {
        const questionDetailsCached = preloadedQuestions[questionId];
        if (questionDetailsCached) {
            setCurrentQuestion(questionDetailsCached);
        } else {
            const questionDetails = await executeAsyncFunctionAndObserveState(
                setIsLoadingScreenShown,
                getQuestionDetails,
                testSession,
                questionId
            );
            setCurrentQuestion(questionDetails);
            setPreloadedQuestions({
                ...preloadedQuestions,
                [questionId]: questionDetails
            });
        }
    }, [testSession, preloadedQuestions]);

    const moveToQuestionWithIndex = useCallback(async (index) => {
        await loadQuestionInfo(questionsWithIds[index]);
        setCurrentQuestionIndex(index);
    }, [loadQuestionInfo, questionsWithIds]);

    const loadTestInfo = useCallback(async (sessionId) => {
        const testInfo = await getInfoAboutTestBySession(sessionId);
        setTestInfo(testInfo);
    }, []);

    useEffect(() => {
        (async () => {
            if (testSession) {
                loadTestInfo(testSession);
                const questionsWithIds = await executeAsyncFunctionAndObserveState(
                    setIsLoadingScreenShown,
                    getSessionQuestionsWithIds,
                    testSession
                );
                let questionsState = [];
                questionsWithIds.forEach((questionId, index) => {
                    questionsState[index] = {
                        questionId,
                        answered: false,
                        selectedOption: null,
                        selectedOptionOrderNr: null
                    };
                });
                setQuestionsWithIds(questionsWithIds);
                setQuestionsState(questionsState);
                if (questionsWithIds.length > 0)
                    await loadQuestionInfo(questionsWithIds[0]);
            }
        })();
    }, [testSession]);

    const onAnswerSelected = useCallback((selectedOptionIndex) => {
        let newQuestionsState = [...questionsState];
        newQuestionsState[currentQuestionIndex] = {
            ...newQuestionsState[currentQuestionIndex],
            answered: true,
            selectedOptionOrderNr: selectedOptionIndex,
            selectedOption: currentQuestion.questionOptions[selectedOptionIndex]
        };
        setQuestionsState(newQuestionsState);
    }, [questionsState, currentQuestionIndex, currentQuestion]);

    const onQuestionSelectedFromList = useCallback(async (questionIndex) => {
        moveToQuestionWithIndex(questionIndex);
    }, [moveToQuestionWithIndex]);

    const onMainButtonClick = useCallback(() => {
        if (currentQuestionIndex < (questionsWithIds.length - 1)) {
            moveToQuestionWithIndex(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, questionsWithIds, moveToQuestionWithIndex]);

    return (
        <>
            <LayoutSetup title={`Quizio - Take test ${testInfo ? `"${testInfo.testName}"` : ''}`} />
            {isLoadingScreenShown ?
                <LoadingSpinner />
                :
                ""
            }
            <main>
                <div className="layout-organizer">
                    <header>
                        <h1>Taking test: <span>{testInfo ? testInfo.testName : ''}</span> </h1>
                    </header>
                    <section className="questions-list">
                        <QuestionsList
                            numberOfQuestions={questionsWithIds.length}
                            currentQuestionOrderNr={currentQuestionIndex + 1}
                            onQuestionSelected={onQuestionSelectedFromList}
                            questionsState={questionsState} />
                    </section>
                    <div className="horizontally-centered question-grid">
                        <div className="question-container">
                            {currentQuestion ?
                                <>
                                    <Question
                                        question={`${currentQuestionIndex + 1}. ${currentQuestion.questionTitle}`}
                                        options={currentQuestion.questionOptions}
                                        onAnswerSelected={onAnswerSelected}
                                        currentlySelectedAnswerOrderNr={questionsState[currentQuestionIndex] ? questionsState[currentQuestionIndex].selectedOptionOrderNr : null} />
                                </>
                                :
                                null
                            }
                        </div>
                    </div>
                    <section className="main-button-container">
                        <PrimaryButton
                            title="Next"
                            color="pink"
                            medium
                            onClick={onMainButtonClick} />
                    </section>
                </div>
            </main>
            <style jsx>
                {`
                    header h1{
                        grid-area: header;
                        font-weight: 300;
                        color: rgba(0,0,0,0.6);
                    }
                    header h1 span {
                        font-weight: 400;
                    }
                    main {
                        width: 100%;
                        height: 100vh;
                    }
                    .main-button-container {
                        grid-area: main-button;
                        justify-self: end;
                        align-self: start;
                        margin-right: 50px;
                    }
                    .layout-organizer {
                        height: 100%;
                        display: grid;
                        padding: 50px;
                        grid-template-rows: auto 1fr auto;
                        grid-template-columns: 1.2fr 5fr;
                        grid-template-areas:
                            "header header"
                            ". question"
                            "questions-list main-button";
                    }
                    .questions-list {
                        grid-area: questions-list;
                        align-self: end;
                        padding-bottom: 40px;
                    }
                    .question-grid {
                        grid-area: question;
                    }
                    .question-container {
                        width: 60vw;
                        min-width: 400px;
                        display: flex;
                        flex-direction:column;
                        padding-top: 50px;
                    }
            `}
            </style>
        </>
    )
}

const Question = ({ question, options = [], onAnswerSelected, currentlySelectedAnswerOrderNr }) => {
    return (
        <>
            <div className="outer-container">
                <span className="question">{question}</span>
                {options.map((option, index) => {
                    const extraClassNames = currentlySelectedAnswerOrderNr != null ?
                        index === currentlySelectedAnswerOrderNr ? "selected" : "" : "";

                    return (
                        <div className={`option ${extraClassNames}`} key={option.id} onClick={() => onAnswerSelected(index)}>
                            <span className="nr">{index + 1}.</span>
                            <span className="answer">
                                {option.questionOptionText}
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

                    .option.selected {
                        box-shadow: 0px 0px 12px #ab47bc;
                        background-color: #ab47bc;
                        color: white;
                    }

                    .option:not(.selected):not(.inactive):hover {
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

const QuestionsList = ({ numberOfQuestions = 23, currentQuestionOrderNr = 1, onQuestionSelected, questionsState }) => {

    const getCallbackForQuestionSelect = useCallback((index) => () => {
        onQuestionSelected(index);
    }, [onQuestionSelected]);

    return (
        <>
            <div className="layout">
                {[...Array(numberOfQuestions)].map((el, index) => {
                    let extraCSS = index + 1 == currentQuestionOrderNr ? " current" : "";
                    extraCSS += questionsState[index] ? questionsState[index].answered ? ' answered' : '' : '';
                    return (
                        <div key={index}
                            className={`element${extraCSS}`}
                            title={`Go to question ${index + 1}`}
                            onClick={getCallbackForQuestionSelect(index)}>
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
                  gap: 2px;
                  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
                  place-items: center;
                  align-content: start;
                }
                .element {
                    position: relative;
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
                    background-color: rgba(0,0,0,0.15);
                }
                .element::after {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 10px;
                    top: 0px;
                    right: 0px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #ab47bc;
                    opacity: 0;
                    transition: all 0.3s;
                }
                .element.answered::after {
                    opacity: 1;
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