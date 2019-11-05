import Question from '../../../components/quizzes/adminComponents/Question';
import Router, { useRouter } from 'next/router';
import { getAllQuestionsOfAQuiz, saveQuestion, getNewSessionForQuiz } from '../../../utils/QuizRequests';
import LayoutSetup from '../../../components/layoutSetup';
import { addOptionToQuestion, setNewAnswerOptionAsCorrectAnswer, deleteQuestionOptionFromQuestion, deleteQuestion } from '../../../utils/QuizRequests';
import FloatingActionButton from '../../../components/FloatingActionButton';
import CreateQuestionDialog from '../../../components/quizzes/CreateQuestionDialog';
import { useState, useCallback, useRef } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { executeAsyncFunctionAndObserveState } from '../../../utils/AsyncUtils';
import GenericDailog from '../../../components/GenericDailog';

const getNewQuestionsWithUpdatedQuestionOptions = (questions, questionId, newQuestionOptions) => {
    const questionOptionUpdated = questions.find(question => question.id == questionId);
    const questionToAlterIndex = questions.indexOf(questionOptionUpdated);
    if (questionOptionUpdated) {
        return [
            ...questions.slice(0, questionToAlterIndex),
            {
                ...questionOptionUpdated,
                questionOptions: newQuestionOptions
            },
            ...questions.slice(questionToAlterIndex + 1, questions.length)
        ]
    }
    return questions;
}

export default () => {
    const [questions, setQuestions] = React.useState([]);
    const { genericQuizId } = useRouter().query;
    const [isCreatingQuestionInProgress, setIsCreatingQuestionInProgress] = useState(false);
    const [wereQuestionsLoaded, setWereQuestionsLoaded] = useState(false);
    const [isAsyncOperationInProgress, setIsAsyncOperationInProgress] = useState(false);
    const [isDoneDialogShown, setIsDoneDialogShown] = useState(false);
    const quizDoneLinkRef = useRef(null);
    const quizzDoneLink = `localhost:3000/takeQuizz/${genericQuizId}`;
    const [wasQuizDoneURLCopied, setWasQuizDoneURLCopied] = useState(false);

    React.useEffect(() => {
        (async () => {
            if (genericQuizId) {
                setQuestions(await executeAsyncFunctionAndObserveState(
                    setIsAsyncOperationInProgress,
                    getAllQuestionsOfAQuiz,
                    genericQuizId
                ));
                setWereQuestionsLoaded(true);
            }
        })();
    }, [genericQuizId]);



    const getOnAddNewOptionCallback = (questionId) => async (newQuestionOption) => {
        const newQuestionOptions = await executeAsyncFunctionAndObserveState(
            setIsAsyncOperationInProgress,
            addOptionToQuestion,
            questionId,
            newQuestionOption);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    };

    const getOnSetNewCorrectAnswerCallback = (questionId) => async (questionOptionId) => {
        const newQuestionOptions = await executeAsyncFunctionAndObserveState(
            setIsAsyncOperationInProgress,
            setNewAnswerOptionAsCorrectAnswer,
            questionId,
            questionOptionId
        );
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    };

    const getOnDeleteQuestionOptionFromQuestion = (questionId) => async (questionOptionId) => {
        const newQuestionOptions = await executeAsyncFunctionAndObserveState(
            setIsAsyncOperationInProgress,
            deleteQuestionOptionFromQuestion,
            questionId,
            questionOptionId
        );
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    }

    const getOnDeleteQuestionCallback = (questionId) => async () => {
        const { status } = await executeAsyncFunctionAndObserveState(
            setIsAsyncOperationInProgress,
            deleteQuestion,
            questionId
        );
        if (status >= 200 && status <= 300) {
            const question = questions.find(question => question.id === questionId);
            if (question) {
                const indexOfQuestionToDelete = questions.indexOf(question);
                setQuestions(
                    [
                        ...questions.slice(0, indexOfQuestionToDelete),
                        ...questions.slice(indexOfQuestionToDelete + 1, questions.length)
                    ]
                )
            }
        }
    }

    const onCreateQuestionClick = useCallback(() => {
        setIsCreatingQuestionInProgress(true);
    }, []);

    const onCancelCreateNewQuestion = useCallback(() => {
        setIsCreatingQuestionInProgress(false);
    }, []);

    const onSaveQuestion = useCallback(async (questionTitle, questionOptions) => {
        setIsCreatingQuestionInProgress(false);
        await executeAsyncFunctionAndObserveState(
            setIsAsyncOperationInProgress,
            saveQuestion,
            genericQuizId,
            questionTitle,
            questionOptions,
            questionOptions[0]
        );
        setQuestions(await executeAsyncFunctionAndObserveState(
            setIsAsyncOperationInProgress,
            getAllQuestionsOfAQuiz,
            genericQuizId
        ));
    }, [genericQuizId]);

    const onTryQuizOutLinkClick = useCallback(async () => {
        const { sessionId } = await getNewSessionForQuiz(genericQuizId);
        Router.push(`/quiz/${sessionId}`);
    }, [genericQuizId]);

    const onQuizzDoneButtonPress = useCallback(() => {
        setIsDoneDialogShown(true);
    }, []);

    const closeIsDoneDialog = useCallback(() => {
        setIsDoneDialogShown(false);
        setWasQuizDoneURLCopied(false);
    }, []);

    const onQuizDoneLinkClick = useCallback(() => {
        quizDoneLinkRef.current.select();
        document.execCommand("copy");
        setWasQuizDoneURLCopied(true);
    }, [quizDoneLinkRef, quizzDoneLink]);

    return (
        <>
            <LayoutSetup />
            {isAsyncOperationInProgress ?
                <LoadingSpinner />
                :
                null
            }
            <header>
                <div className="absolutely-centered">
                    <h1>Quizzio</h1>
                </div>
                <button onClick={onQuizzDoneButtonPress}>Done</button>
            </header>
            <main>
                <section className="questions">
                    {questions.map(question =>
                        <Question
                            questionTitle={question.question}
                            questionOptions={question.questionOptions}
                            key={question.id}
                            onAddNewOption={getOnAddNewOptionCallback(question.id)}
                            onSetNewCorrectAnswer={getOnSetNewCorrectAnswerCallback(question.id)}
                            onDeleteQuestionOption={getOnDeleteQuestionOptionFromQuestion(question.id)}
                            onDeleteQuestion={getOnDeleteQuestionCallback(question.id)}
                        />
                    )}
                </section>
                {questions.length === 0 && wereQuestionsLoaded ?
                    <section className="no-questions-yet-section">
                        <span>Create a question with the</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#422d74"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
                        <span>
                            button.
                        </span>
                    </section>
                    :
                    null
                }
                <FloatingActionButton
                    title="Create question"
                    onClick={onCreateQuestionClick} />
                {isCreatingQuestionInProgress ?
                    <CreateQuestionDialog
                        onSaveQuestion={onSaveQuestion}
                        onDismissDialog={onCancelCreateNewQuestion} />
                    :
                    null
                }
                <footer onClick={onTryQuizOutLinkClick}>
                    <span>Try the quiz out!</span>
                </footer>
            </main>
            {isDoneDialogShown ?
                <GenericDailog title="Are you done?" onDismissDialog={closeIsDoneDialog}>
                    <p className="done-dialog__description">Copy this link and give to others to take this quizz:</p>
                    <input
                        ref={quizDoneLinkRef}
                        type="text"
                        className="done-dialog__quiz-link"
                        value={quizzDoneLink}
                        onClick={onQuizDoneLinkClick} />
                        {
                            wasQuizDoneURLCopied ? 
                            <div className="done-dialog__copied-to-clipboard-shell">
                                <img src="/static/clipboard.svg" />
                                <p className="done-dialog__copied-to-clipboard-text">Copied to clipboard.</p>
                            </div>
                            :
                            null
                        }
                </GenericDailog>
                :
                null
            }
            <style jsx>
                {`
                    header {
                        height: 50px;
                        background-color: white;
                        box-shadow: 0px 0px 10px #9a9a9a;
                        position: fixed;
                        left: 0;
                        right: 0;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        padding: 0px 20px;
                    }
                    header h1 {
                        color: black;
                    }
                    header button {
                        width: 100px;
                        height: 30px;
                        outline: none;
                        border: none;
                        background-color: #951750;
                        box-shadow: 0px 0px 7px #951750;
                        font-family: inherit;
                        color: white;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1em;
                        transition: all 0.3s;
                    }
                    header button:hover {
                        box-shadow: 0px 0px 12px #951750;
                    }
                    .absolutely-centered{
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    main {
                        padding-top: 60px;
                    }
                    .questions {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .no-questions-yet-section {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        width: 100%;
                        transform: translate(-50%, -50%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    .no-questions-yet-section svg {
                        margin: 0px 3px;
                    }
                    .no-questions-yet-section span {
                        font-size: 1.6em;
                        white-space: nowrap;
                    }
                    footer {
                        position: fixed;
                        bottom: 0px;
                        height: 30px;
                        background-color: skyblue;
                        z-index: -1;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        color: black;
                        cursor: pointer;
                    }
                    .done-dialog__description {
                        font-size: 1.3em;
                        font-weight: 300;
                    }
                    .done-dialog__quiz-link {
                        width: 100%;
                        height: 50px;
                        font-family: inherit;
                        font-size: 1.3em;
                        text-align: center;
                        margin-top: 50px;
                        outline: none;
                        border: 1px solid grey;
                    }
                    .done-dialog__quiz-link:focus {
                        border: 1px solid transparent;
                        box-shadow: 0px 0px 10px grey;
                    }
                    .done-dialog__copied-to-clipboard-shell {
                        display: flex;
                        justify-content: center;
                        align-items:center;
                        margin-top: 10px;
                    }
                    .done-dialog__copied-to-clipboard-shell img{
                        width: 25px;
                    }
                `}
            </style>
        </>
    )
}