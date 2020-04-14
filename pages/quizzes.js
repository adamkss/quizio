import { useEffect, useState, useCallback } from 'react';
import { deleteQuiz, getQuizzesOfCurrentUser, createNewGenericQuiz } from '../utils/QuizRequests';
import Router from 'next/router';
import { QuizzesLayoutWrapper } from '../components/quizzes/QuizzesLayoutWrapper';
import GenericDialog from '../components/GenericDailog';
import TextInput from '../components/TextInput';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationDialog from '../components/ConfirmationDialog';
import withAuthSetUp from '../hocs/withAuthSetUp';
import { useObserverPattern } from '../hooks/useObserverPattern';

const Quizzes = () => {
    const [quizes, setQuizzes] = React.useState([]);
    const [isCreatingNewDialogInProgress, setIsCreatingNewDialogInProgress] = useState(false);
    const [quizIdToDelete, setQuizIdToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addObserverCallback, triggerObservers } = useObserverPattern();

    const getAllQuizzes = useCallback(async () => {
        setIsLoading(true);
        const quizes = await getQuizzesOfCurrentUser();
        setIsLoading(false);
        setQuizzes(quizes);
    }, []);

    useEffect(() => {
        getAllQuizzes();
    }, []);

    const getOnClickCallbackForQuizPress = (quizId) => () => {
        Router.push(`/genericQuizzes/${quizId}/editor`);
    }

    const onCreateNewQuizPress = useCallback(() => {
        setIsCreatingNewDialogInProgress(true);
    }, []);

    const onDismissDialogPress = useCallback(() => {
        setIsCreatingNewDialogInProgress(false);
    }, []);

    const onCreateNewQuiz = useCallback(async (newQuizName) => {
        setIsLoading(true);
        const newQuiz = await createNewGenericQuiz(newQuizName);
        setQuizzes((quizes) => [...quizes, newQuiz]);
        onDismissDialogPress();
        setIsLoading(false);
        triggerObservers();
    }, [triggerObservers]);

    const getDeleteQuizCallback = useCallback((quizId) => async () => {
        setQuizIdToDelete(quizId);
    }, []);

    const abandonDeletionOfQuiz = useCallback(() => {
        setQuizIdToDelete(null);
    }, []);

    const onDeleteQuizConfirm = useCallback(async () => {
        setIsLoading(true);
        const wasDeleted = await deleteQuiz(quizIdToDelete);
        setIsLoading(false);
        if (wasDeleted) {
            getAllQuizzes();
            setQuizIdToDelete(null);
        }
    }, [quizIdToDelete]);

    const getOnSeeResultsOfQuizClickCallback = useCallback((quizId) => () => {
        Router.push(`/genericQuizzes/${quizId}/results`);
    }, []);

    return (
        <QuizzesLayoutWrapper isLoading={isLoading} addObserverCallback={addObserverCallback}>
            <>
                <main>
                    <section className="quizes">
                        {quizes.map(quiz =>
                            <div className="quiz" key={quiz.id}>
                                <h2>{quiz.name}</h2>
                                <button className="quiz-operation-button" onClick={getOnClickCallbackForQuizPress(quiz.id)}>
                                    Open quiz editor
                                </button>
                                <button className="quiz-operation-button" onClick={getOnSeeResultsOfQuizClickCallback(quiz.id)}>
                                    See results of users
                                </button>
                                <img
                                    title="Delete quiz"
                                    className="delete-quiz-icon"
                                    src="/static/delete-24px.svg"
                                    onClick={getDeleteQuizCallback(quiz.id)}
                                />
                            </div>
                        )}
                    </section>
                    <button className="icon-button">
                        <img
                            title="Create new quiz"
                            className="add-quiz-fab"
                            src="/static/create_fab.svg"
                            onClick={onCreateNewQuizPress}
                        />
                    </button>
                </main>
                {isCreatingNewDialogInProgress ?
                    <CreateNewQuizDialog
                        onDismissDialog={onDismissDialogPress}
                        onCreateNewQuiz={onCreateNewQuiz} />
                    :
                    null}
                {quizIdToDelete ?
                    <ConfirmationDialog
                        title="Are you sure you want to delete the quiz?"
                        onCancel={abandonDeletionOfQuiz}
                        onConfirm={onDeleteQuizConfirm} />
                    :
                    null}
                <style jsx>
                    {`
                    main {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 20px;
                        position: relative;
                    }
                    .quizes {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        margin: -13px;
                    }
                    .quiz {
                        padding: 25px 25px;
                        padding-top: 40px;
                        font-size: 1.9em;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
                        border-radius: 5px;
                        transition: all 0.3s;
                        background-color: white;
                        margin: 13px;
                        animation: SlideUp 0.3s;
                        position: relative;
                    }
                    .delete-quiz-icon {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        cursor: pointer;
                        opacity: 0.5;
                        transition: all 0.3s;
                    }
                    .quiz:hover .delete-quiz-icon {
                        opacity: 1;
                    }
                    @keyframes SlideUp {
                        0% {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0px);
                            opacity: 1;
                        }
                    }
                    .quiz:hover {
                        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
                    }
                    .quiz h2 {
                        padding: 0;
                        margin: 0;
                        margin-bottom: 10px;
                    }
                    .quiz-operation-button {
                        width: 100%;
                        display: block;
                        background-color: white;
                        outline: none;
                        border: none;
                        font-family: inherit;
                        font-size: 0.7em;
                        padding: 10px;
                        margin: 0;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: all 0.3s;
                        margin-bottom: 10px;
                        text-align: left;
                    }
                    .quiz-operation-button:hover {
                        background-color: #103A67;
                        color: white;
                        box-shadow: 0px 0px 5px #103A67;
                    }
                    .add-quiz-fab {
                        width: 50px;
                        height: 50px;
                        position: fixed;
                        bottom: 25px;
                        right: 25px;
                        cursor: pointer;
                        border-radius: 50%;
                    }
                `}
                </style>
            </>
        </QuizzesLayoutWrapper>
    )
}

const CreateNewQuizDialog = ({ onDismissDialog, onCreateNewQuiz }) => {
    const [newQuizName, setNewQuizName] = useState("");
    const onSavePress = useCallback(() => {
        onCreateNewQuiz(newQuizName);
    }, [newQuizName, onCreateNewQuiz]);

    return (
        <GenericDialog title="Create new quiz" onDismissDialog={onDismissDialog}>
            <TextInput title="New quiz name:"
                value={newQuizName}
                autoFocus
                width="100%"
                placeholder="New quiz name here..."
                valueSetter={setNewQuizName} />
            <PrimaryButton
                rightAligned
                title="Create quiz"
                marginTop
                medium
                inactive={newQuizName === ""}
                onClick={onSavePress} />
        </GenericDialog>
    )
}

export default withAuthSetUp(Quizzes);