import { useRouter } from 'next/router'
import { getAllQuestionsOfAQuiz, saveQuestion, addOptionToQuestion, setNewAnswerOptionAsCorrectAnswer, deleteQuestionOptionFromQuestion, deleteQuestion } from '../../../../../utils/QuizRequests';
import { useState, useCallback, useEffect, useRef } from 'react';
import { BackOfficeLayoutWrapper } from '../../../../../components/BackOfficeLayoutWrapper';
import Question from '../../../../../components/quizzes/adminComponents/Question';
import CreateQuestionDialog from '../../../../../components/quizzes/CreateQuestionDialog';

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
    const { quizId } = useRouter().query;
    const [questions, setQuestions] = useState([]);
    const [isCreatingQuestionNow, setIsCreatingQuestionNow] = useState(false);

    const getAndSetAllQuestionsOfAQuiz = useCallback(async (quizId) => {
        if (quizId) {
            const questions = await getAllQuestionsOfAQuiz(quizId);
            setQuestions(questions);
        }
    }, [quizId]);

    useEffect(() => {
        getAndSetAllQuestionsOfAQuiz(quizId);
    }, [quizId]);

    const createQuestionCallback = useCallback(() => {
        setIsCreatingQuestionNow(true);
    }, [quizId]);

    const onDismissCreateQuestionDialog = useCallback(() => {
        setIsCreatingQuestionNow(false);
    }, []);

    const onSaveQuestion = (title, questionOptions, rightAnswer) => {
        saveQuestion(quizId, title, questionOptions, rightAnswer).then(() => {
            setIsCreatingQuestionNow(false);
            getAndSetAllQuestionsOfAQuiz(quizId);
        });
    }

    const getOnAddNewOptionCallback = (questionId) => async (newQuestionOption) => {
        const newQuestionOptions = await addOptionToQuestion(questionId, newQuestionOption);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    };

    const getOnSetNewCorrectAnswerCallback = (questionId) => async (questionOptionId) => {
        const newQuestionOptions = await setNewAnswerOptionAsCorrectAnswer(questionId, questionOptionId);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    };

    const getOnDeleteQuestionOptionFromQuestion = (questionId) => async (questionOptionId) => {
        const newQuestionOptions = await deleteQuestionOptionFromQuestion(questionId, questionOptionId);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    }

    const getOnDeleteQuestionCallback = (questionId) => async () => {
        const { status } = await deleteQuestion(questionId);
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

    return (
        <BackOfficeLayoutWrapper>
            <>
                <main>
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
                    <img
                        title="Create new question"
                        className="add-question-fab"
                        src="/static/create_fab.svg"
                        onClick={createQuestionCallback} />
                    {isCreatingQuestionNow ?
                        <CreateQuestionDialog
                            onDismissDialog={onDismissCreateQuestionDialog}
                            onSaveQuestion={onSaveQuestion} />
                        :
                        null}
                </main>
                <style jsx>
                    {`
                main {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    padding: 20px;
                    margin: -10px;
                    position: relative;
                }
                .add-question-fab {
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    cursor: pointer;
                    border-radius: 50%;
                }
                `}
                </style>
            </>
        </BackOfficeLayoutWrapper>
    )
}

