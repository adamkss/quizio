import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import LayoutSetup from "../../../components/layoutSetup";
import Link from 'next/link';
import { getTestById, getAllQuestionsOfTest, addQuestionOptionToQuestion, createQuestion, getQuestionOfTest, updateCorrectQuestionOption, deleteQuestionOption, deleteQuestion } from "../../../utils/TestRequests";
import withAuthSetUp from "../../../hocs/withAuthSetUp";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { executeAsyncFunctionAndObserveState } from '../../../utils/AsyncUtils';
import Question from "../../../components/quizzes/adminComponents/Question";
import FloatingActionButton from "../../../components/FloatingActionButton";
import CreateQuestionDialog from "../../../components/quizzes/CreateQuestionDialog";

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
        const testQuestions = await executeAsyncFunctionAndObserveState(
            setIsLoadingInProgress,
            getAllQuestionsOfTest,
            testId
        );
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

    return (
        <>
            <LayoutSetup />
            {isLoadingInProgress ?
                <LoadingSpinner />
                :
                null
            }
            <header>
                <Link href="/schools/tests">
                    <a className="header__back-button" title="Back">
                        <img src="/static/left-arrow.svg" alt="Back" />
                    </a>
                </Link>
                <div className="flex-space" />
                <h1 className="header__title">Quizio Schools</h1>
                <button className="header__test-settings-button" onClick={() => { }}>
                    <img src="/static/settings.svg"></img>
                    <span>Test Settings</span>
                </button>
                <button className="header__done-button" onClick={() => { }}>Done</button>
            </header>
            <main>
                {questions.map(question =>
                    <Question
                        questionTitle={question.questionOrderNumber + '. ' + question.questionTitle}
                        questionOptions={question.questionOptions}
                        questionOptionTitleKey={'questionOptionText'}
                        key={question.id}
                        onAddNewOption={getOnAddNewOptionCallback(question.id)}
                        onSetNewCorrectAnswer={getOnSetNewCorrectAnswerCallback(question.id)}
                        onDeleteQuestionOption={getOnDeleteQuestionOptionFromQuestion(question.id)}
                        onDeleteQuestion={getOnDeleteQuestionCallback(question.id)}
                    />
                )}
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
                    }
                    @media (min-width: 475px) {
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
                        margin-right: 5px;
                    }
                    .header__back-button{
                        width: 34px;
                        height: 34px;
                        padding: 7px;
                        border-radius: 50%;
                        transition: all 0.3s;
                    }
                    .header__back-button:hover {
                        background-color: hsl(0, 0%, 85%);
                    }
                    .header__back-button:active {
                        background-color: hsl(0, 0%, 75%);
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

export default withAuthSetUp(Editor);