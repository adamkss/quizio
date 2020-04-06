import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import LayoutSetup from "../../../components/layoutSetup";
import Link from 'next/link';
import { getTestById, getAllQuestionsOfTest, addQuestionOptionToQuestion, createQuestion, getQuestionOfTest, updateCorrectQuestionOption, deleteQuestionOption, deleteQuestion, moveQuestions, updateTestSettings } from "../../../utils/TestRequests";
import withAuthSetUp from "../../../hocs/withAuthSetUp";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { executeAsyncFunctionAndObserveState } from '../../../utils/AsyncUtils';
import Question from "../../../components/quizzes/adminComponents/Question";
import FloatingActionButton from "../../../components/FloatingActionButton";
import CreateQuestionDialog from "../../../components/quizzes/CreateQuestionDialog";
import { Grid, GridElement } from "../../../components/dnd/GridDND";
import CheckBox from '../../../components/CheckBox';
import { getArrayAfterElementMove } from '../../../utils/OpsUtils';
import GenericDialog from '../../../components/GenericDailog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import TextInput from '../../../components/TextInput';
import PrimaryButton from '../../../components/PrimaryButton';

const findQuestionById = (questions, id) => {
    return questions.find(question => question.id == id);
}

const indexOfQuestionToAlter = (questions, question) => {
    return questions.indexOf(question);
}

const getQuestionsForReplacedQuestionOptionsOfQuestion = (questions, questionId, newQuestionOptions) => {
    const question = findQuestionById(questions, questionId);
    const questionIndex = indexOfQuestionToAlter(questions, question);
    return [
        ...questions.slice(0, questionIndex),
        {
            ...question,
            questionOptions: newQuestionOptions
        },
        ...questions.slice(questionIndex + 1, questions.length)
    ]
}

const getQuestionsForReplacedQuestion = (questions, questionId, newQuestion) => {
    const question = findQuestionById(questions, questionId);
    const questionIndex = indexOfQuestionToAlter(questions, question);
    return [
        ...questions.slice(0, questionIndex),
        newQuestion,
        ...questions.slice(questionIndex + 1, questions.length)
    ]
}

const Editor = () => {
    const { testId } = useRouter().query;
    const [testInfo, setTestInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false);
    const [isCreatingQuestionInProgress, setIsCreatingQuestionsInProgress] = useState(false);
    const [isDNDEnabled, setIsDNDEnabled] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const loadTestInfo = React.useCallback(async () => {
        const testInfo = await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            getTestById,
            testId
        );
        setTestInfo(testInfo);
    }, [testId, getTestById, executeAsyncFunctionAndObserveState]);

    const reloadQuestion = React.useCallback(async (questionId) => {
        const newQuestion = await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            getQuestionOfTest,
            questionId
        );
        setQuestions(
            getQuestionsForReplacedQuestion(
                questions,
                questionId,
                newQuestion
            )
        );
    }, [questions]);

    const loadTestQuestions = React.useCallback(async () => {
        const testQuestions = (await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            getAllQuestionsOfTest,
            testId
        )).sort((a, b) => a.questionOrderNumber - b.questionOrderNumber);
        setQuestions(testQuestions);
    }, [testId, getAllQuestionsOfTest, executeAsyncFunctionAndObserveState]);

    useEffect(() => {
        if (testId) {
            (async () => {
                await loadTestInfo();
                await loadTestQuestions();
            })();
        }
    }, [testId]);

    const onAddQuestionFABClick = React.useCallback(() => {
        setIsCreatingQuestionsInProgress(true);
    }, []);

    const onDismissCreateQuestionDialog = React.useCallback(() => {
        setIsCreatingQuestionsInProgress(false);
    }, []);

    const onSaveQuestion = React.useCallback(async (title, options) => {
        await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            createQuestion,
            testId,
            title,
            options
        );
        await loadTestQuestions();
        onDismissCreateQuestionDialog();
    }, [testId]);

    const getOnAddNewOptionCallback = React.useCallback((questionId) => {
        return async (newOptionText) => {
            const newQuestionOption = await executeAsyncFunctionAndObserveState(
                setIsLoadingInProgress,
                addQuestionOptionToQuestion,
                questionId,
                newOptionText
            );
            const question = findQuestionById(questions, questionId);
            setQuestions(getQuestionsForReplacedQuestionOptionsOfQuestion(
                questions, questionId, [...question.questionOptions, newQuestionOption]
            ));
        }
    }, [questions]);

    const getOnSetNewCorrectAnswerCallback = React.useCallback((questionId) => {
        return async (newCorrectOptionId) => {
            await executeAsyncFunctionAndObserveState(
                setIsLoadingInProgress,
                updateCorrectQuestionOption,
                questionId,
                newCorrectOptionId
            );
            reloadQuestion(questionId);
        }
    }, [reloadQuestion]);

    const getOnDeleteQuestionOptionFromQuestion = React.useCallback((questionId) => {
        return async (questionOptionId) => {
            await executeAsyncFunctionAndObserveState(
                setIsLoadingInProgress,
                deleteQuestionOption,
                questionOptionId
            );
            reloadQuestion(questionId);
        }
    }, [reloadQuestion]);

    const getOnDeleteQuestionCallback = React.useCallback((questionId) => {
        return async () => {
            await executeAsyncFunctionAndObserveState(
                setIsLoadingInProgress,
                deleteQuestion,
                questionId
            );
            loadTestQuestions();
        }
    }, [questions]);

    const onReorganizeCheckboxChange = React.useCallback(() => {
        setIsDNDEnabled(dnd => !dnd);
    }, []);

    const onElementMove = React.useCallback(async ({ sourceIndex, targetIndex }) => {
        setQuestions(getArrayAfterElementMove(questions, sourceIndex, targetIndex));
        await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            moveQuestions,
            testId,
            sourceIndex,
            targetIndex
        );
        loadTestQuestions();
    }, [testId, questions]);

    const onSettingsPress = React.useCallback(() => {
        setIsSettingsDialogOpen(true);
    }, []);

    const onSettingsClose = React.useCallback(() => {
        setIsSettingsDialogOpen(false)
    }, []);

    const onSettingsSave = React.useCallback(async (testName, showResultAtTheEnd) => {
        onSettingsClose();
        await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            updateTestSettings,
            testId,
            {
                showResultAtTheEnd
            }
        );
    }, [testId, onSettingsClose]);

    return (
        <>
            <LayoutSetup title="Quizio Schools - Test editor" />
            {isLoadingInProgress ?
                <LoadingSpinner />
                :
                null
            }
            <header>
                <Link href="/schools/tests">
                    <a className="header__back-button" title="Back">
                        <img src="/static/left-arrow.svg" alt="Back" />
                        <span className="header-back__title">Quizio Schools</span>
                    </a>
                </Link>
                <div className="flex-space" />
                <h1 className="header__title">EDITING TEST: "<span className="header-title__quiz-name">{(testInfo && testInfo.name) || ''}</span>"</h1>
                <CheckBox
                    title={"Reorganize:"}
                    checked={isDNDEnabled}
                    onChange={onReorganizeCheckboxChange}
                    leftSideTitle
                    extraCSS='margin-right:10px;'
                />
                <button className="header__test-settings-button" onClick={onSettingsPress}>
                    <img src="/static/settings.svg"></img>
                    <span>Test Settings</span>
                </button>
                <button className="header__done-button" onClick={() => { }}>Done</button>
            </header>
            <main>
                <Grid isDragEnabled={isDNDEnabled} scrollable insidePadding={20} fixedHeight="100%" onElementMove={onElementMove}>
                    {questions.map((question, index) =>
                        <GridElement key={question.id}>
                            <Question
                                questionTitle={(index + 1) + '. ' + question.questionTitle}
                                questionOptions={question.questionOptions}
                                questionOptionTitleKey={'questionOptionText'}
                                onAddNewOption={getOnAddNewOptionCallback(question.id)}
                                onSetNewCorrectAnswer={getOnSetNewCorrectAnswerCallback(question.id)}
                                onDeleteQuestionOption={getOnDeleteQuestionOptionFromQuestion(question.id)}
                                onDeleteQuestion={getOnDeleteQuestionCallback(question.id)}
                            />
                        </GridElement>
                    )}
                </Grid>
                {isCreatingQuestionInProgress ?
                    <CreateQuestionDialog
                        onDismissDialog={onDismissCreateQuestionDialog}
                        onSaveQuestion={onSaveQuestion} />
                    :
                    null
                }
                <FloatingActionButton
                    title="Add question"
                    onClick={onAddQuestionFABClick}
                />
                {isSettingsDialogOpen ?
                    <TestSettingsDialog
                        initialTestName={testInfo.name}
                        initialIsShowingOfFinalProcentEnabled={testInfo.showResultAtTheEnd}
                        onCancel={onSettingsClose}
                        onSave={onSettingsSave} />
                    :
                    null
                }
            </main>
            <style jsx>
                {`
                header {
                        height: 50px;
                        width: 100%;
                        position: relative;
                        background-color: rgba(255, 255, 255, 1);
                        box-shadow: 0px 0px 10px #9a9a9a;
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
                    .header__title {
                        display: none;
                        vertical-align: middle;
                        text-align: center;
                        font-weight: 400;
                        font-size: 1.4rem;
                    }
                    .header-title__quiz-name {
                        font-weight: 500;
                        font-size: 1.6rem;
                    }
                    @media (min-width: 924px) {
                        .header__title {
                            display: block;
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                    .header__test-settings-button {
                        margin-right: 10px;
                    }
                    .header__test-settings-button:hover {
                        background-color: hsl(0, 0%, 85%);
                    }
                    .header__test-settings-button > img {
                        width: 15px;
                    }
                    .header__test-settings-button > span {
                        width: 15px;
                        margin-left: 5px;
                        margin-right: 5px;
                        display: none;
                    }
                    @media (min-width: 600px) {
                        .header__test-settings-button > span {
                            display: inline;
                        }
                    }
                    .header__back-button {
                        display: flex;
                        align-items: center;
                        text-decoration: none;
                    }
                    .header__back-button > img{
                        width: 34px;
                        height: 34px;
                        padding: 7px;
                        border-radius: 50%;
                        transition: all 0.3s;
                    }
                    .header__back-button > img:hover {
                        background-color: hsl(0, 0%, 85%);
                    }
                    .header__back-button > img:active {
                        background-color: hsl(0, 0%, 75%);
                    }
                    .header-back__title {
                        color: black;
                        cursor: pointer;
                        font-size: 1.2rem;
                        margin-left: 5px;
                        display: none;
                    }
                    @media (min-width: 780px) {
                        .header-back__title {
                            display: inline;
                        }
                    }
                    main {
                        height: calc(100vh - 50px);
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        overflow-y: auto;
                    }
                `}
            </style>
        </>
    )
}

const TestSettingsDialog = (
    {
        initialTestName = "",
        initialIsShowingOfFinalProcentEnabled = false,
        onSave,
        onCancel,
        ...restGenericDialogProps
    }) => {
    const [testName, setTestName] = useState(initialTestName);
    const [isShowingOfFinalProcentEnabled, setIsShowingOfFinalProcentEnabled] = useState(initialIsShowingOfFinalProcentEnabled);

    const showingOfFinalProcentCheckBoxStateChangeCallback = React.useCallback((evt) => {
        setIsShowingOfFinalProcentEnabled(evt.target.checked);
    });

    const [isCancellationConfirmationShown, setIsCancellationConfirmationShown] = useState(false);

    const onCancelClick = React.useCallback(() => {
        const wereChangesMade = initialTestName !== testName
            || initialIsShowingOfFinalProcentEnabled !== isShowingOfFinalProcentEnabled;
        if (wereChangesMade)
            setIsCancellationConfirmationShown(true);
        else
            onCancel();
    }, [initialTestName, testName, initialIsShowingOfFinalProcentEnabled, isShowingOfFinalProcentEnabled, onCancel]);

    const onConfirmationDialogCancel = React.useCallback(() => {
        setIsCancellationConfirmationShown(false);
    }, []);

    const onDoneClick = React.useCallback(() => {
        const wereChangesMade = initialTestName !== testName
            || initialIsShowingOfFinalProcentEnabled !== isShowingOfFinalProcentEnabled;
        if (wereChangesMade)
            onSave(testName, isShowingOfFinalProcentEnabled);
        else
            onCancel();
    }, [onSave, initialTestName, testName, initialIsShowingOfFinalProcentEnabled, isShowingOfFinalProcentEnabled]);
    return (
        <>
            {!isCancellationConfirmationShown ?
                <GenericDialog
                    title="Customize Your test"
                    onDismissDialog={onCancelClick}
                    {...restGenericDialogProps}>
                    <TextInput
                        title="Test name:"
                        value={testName}
                        width="100%"
                        valueSetter={setTestName} />
                    <CheckBox
                        title={"Show result of the test to the user."}
                        checked={isShowingOfFinalProcentEnabled}
                        onChange={showingOfFinalProcentCheckBoxStateChangeCallback}
                        marginTop
                        customMarginTop="15px"
                    />
                    <div className="horizontally-end-positioned margin-top">
                        <PrimaryButton
                            title="Done"
                            marginRight
                            medium
                            marginTop
                            onClick={onDoneClick}
                        />
                        <PrimaryButton
                            title="Cancel"
                            color="red"
                            marginTop
                            medium
                            onClick={onCancelClick}
                        />
                    </div>
                </GenericDialog>
                :
                <ConfirmationDialog
                    title="You made changes to the test. Abandon them?"
                    negativeAnswer="No"
                    positiveAnswer="Abandon"
                    positiveIsRed
                    onConfirm={onCancel}
                    onCancel={onConfirmationDialogCancel} />
            }
            <style jsx>
                {`
                    .margin-top {
                        margin-top: 10px;
                    }
                `}
            </style>
        </>
    )
}

export default withAuthSetUp(Editor);