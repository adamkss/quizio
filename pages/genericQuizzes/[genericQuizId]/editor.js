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
import Link from 'next/link';
import TextInput from '../../../components/TextInput';
import CheckBox from '../../../components/CheckBox';
import PrimaryButton from '../../../components/PrimaryButton';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

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
    const [isQuizBeingCustomized, setIsBeingQuizCustomized] = useState(true);

    React.useEffect(() => {
        (async () => {
            if (genericQuizId) {
                // setQuestions(await executeAsyncFunctionAndObserveState(
                //     setIsAsyncOperationInProgress,
                //     getAllQuestionsOfAQuiz,
                //     genericQuizId
                // ));
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

    const onQuizSettingsClick = useCallback(() => {
        setIsBeingQuizCustomized(value => !value);
    }, []);

    const onQuizSettingsDialogDismiss = useCallback(() => {
        setIsBeingQuizCustomized(false);
    }, []);

    const onQuizSettingsSaveClick = useCallback((
        newQuizName,
        newRequestNameOnQuizStartPreference,
        newShowResultPreference) => {
        setIsBeingQuizCustomized(false);
    }, []);

    return (
        <>
            <LayoutSetup />
            {isAsyncOperationInProgress ?
                <LoadingSpinner />
                :
                null
            }
            <header>
                <Link href="/quizzes">
                    <a className="header__back-button" title="Back">
                        <img src="/static/left-arrow.svg" alt="Back" />
                    </a>
                </Link>
                <div className="flex-space" />
                <h1 className="header__title">Quizio</h1>
                <button className="header__quiz-settings-button" onClick={onQuizSettingsClick}>
                    <img src="/static/settings.svg"></img>
                    <span>Quiz Settings</span>
                </button>
                <button className="header__done-button" onClick={onQuizzDoneButtonPress}>Done</button>
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
            </main>
            {isDoneDialogShown ?
                <GenericDailog title="Are you done?" onDismissDialog={closeIsDoneDialog}>
                    <p className="done-dialog__description">Copy this link and give it to others to take this quizz:</p>
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
            {isQuizBeingCustomized ?
                <QuizSettingsDialog
                    onCancel={onQuizSettingsDialogDismiss}
                    onSave={onQuizSettingsSaveClick} />
                :
                ""
            }
            <style jsx>
                {`
                    header {
                        height: 50px;
                        background-color: rgba(255, 255, 255, 1);
                        box-shadow: 0px 0px 10px #9a9a9a;
                        position: fixed;
                        left: 0;
                        right: 0;
                        display: flex;
                        align-items: center;
                        padding: 0px 20px;
                        z-index: 1;
                    }
                    header h1 {
                        color: black;
                    }
                    header button {
                        height: 30px;
                        padding: 0px 8px;
                        outline: none;
                        border: 1px solid rgba(0, 0, 0, 0.3);
                        font-family: inherit;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1em;
                        transition: all 0.3s;
                        background-color: white;
                    }
                    .header__done-button:hover {
                        background-color: #2BAE66;
                        box-shadow: 0px 0px 4px #2BAE66;
                        color: white;
                        border: 1px solid transparent;
                    }
                    .header__back-button {
                        width: 25px;
                    }
                    .header__title {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .header__quiz-settings-button {
                        margin-right: 10px;
                    }
                    .header__quiz-settings-button:hover {
                        background-color: hsl(0, 0%, 85%);
                    }
                    .header__quiz-settings-button > img {
                        width: 15px;
                        margin-right: 5px;
                    }
                    .header__back-button{
                        width: 25px;
                        height: 25px;
                        padding: 3px;
                    }
                    .questions {
                        height: calc(100vh);
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        padding-bottom: 100px;
                        padding-top: 50px;
                        overflow-y: auto;
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

const QuizSettingsDialog = (
    {
        initialQuizName = "",
        initialIsNameOfClientRequired = false,
        initialIsShowingOfFinalProcentEnabled = false,
        onSave,
        onCancel,
        ...restGenericDialogProps
    }) => {
    const [quizName, setQuizName] = useState(initialQuizName);
    const [isNameOfClientRequired, setIsNameOfClientRequired] = useState(false);
    const [isShowingOfFinalProcentEnabled, setIsShowingOfFinalProcentEnabled] = useState(initialIsShowingOfFinalProcentEnabled);

    const nameRequiredCheckBoxStateChangeCallback = React.useCallback((evt) => {
        setIsNameOfClientRequired(evt.target.checked);
    }, []);

    const showingOfFinalProcentCheckBoxStateChangeCallback = React.useCallback((evt) => {
        setIsShowingOfFinalProcentEnabled(evt.target.checked);
    });

    const [isCancellationConfirmationShown, setIsCancellationConfirmationShown] = useState(false);
    const onCancelClick = React.useCallback(() => {
        const wereChangesMade = initialQuizName !== quizName
            || initialIsNameOfClientRequired !== isNameOfClientRequired
            || initialIsShowingOfFinalProcentEnabled !== isShowingOfFinalProcentEnabled;
        if (wereChangesMade)
            setIsCancellationConfirmationShown(true);
        else
            onCancel();
    }, [initialQuizName, quizName, initialIsNameOfClientRequired, isNameOfClientRequired, initialIsShowingOfFinalProcentEnabled, isShowingOfFinalProcentEnabled, onCancel]);

    const onConfirmationDialogCancel = React.useCallback(() => {
        setIsCancellationConfirmationShown(false);
    }, []);

    const onDoneClick = React.useCallback(() => {
        onSave(quizName, isNameOfClientRequired, isShowingOfFinalProcentEnabled);
    }, [onSave, quizName, isNameOfClientRequired, isShowingOfFinalProcentEnabled]);
    return (
        !isCancellationConfirmationShown ?
            <GenericDailog
                title="Customize Your Quiz"
                onDismissDialog={onCancelClick}
                {...restGenericDialogProps}>
                <TextInput
                    title="Quiz name:"
                    value={quizName}
                    valueSetter={setQuizName} />
                <CheckBox
                    title={"Ask for name before taking the quiz."}
                    checked={isNameOfClientRequired}
                    onChange={nameRequiredCheckBoxStateChangeCallback}
                />
                <CheckBox
                    title={"Show result of the quiz to the user."}
                    checked={isShowingOfFinalProcentEnabled}
                    onChange={showingOfFinalProcentCheckBoxStateChangeCallback}
                    marginTop
                />
                <div className="horizontally-end-positioned">
                    <PrimaryButton
                        title="Done"
                        marginRight
                        marginTop
                        onClick={onDoneClick}
                    />
                    <PrimaryButton
                        title="Cancel"
                        color="red"
                        marginTop
                        onClick={onCancelClick}
                    />
                </div>
            </GenericDailog>
            :
            <ConfirmationDialog
                title="You made changes to the quiz. Abandon them?"
                negativeAnswer="No"
                positiveAnswer="Abandon"
                positiveIsRed
                onConfirm={onCancel}
                onCancel={onConfirmationDialogCancel} />
    )
}