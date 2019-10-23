import Question from '../../../components/quizzes/adminComponents/Question';
import { useRouter } from 'next/router';
import { getAllQuestionsOfAQuiz, saveQuestion } from '../../../utils/QuizRequests';
import LayoutSetup from '../../../components/layoutSetup';
import { addOptionToQuestion, setNewAnswerOptionAsCorrectAnswer, deleteQuestionOptionFromQuestion, deleteQuestion } from '../../../utils/QuizRequests';
import FloatingActionButton from '../../../components/FloatingActionButton';
import CreateQuestionDialog from '../../../components/quizzes/CreateQuestionDialog';
import { useState, useCallback } from 'react';

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

    React.useEffect(() => {
        (async () => {
            if (genericQuizId) {
                setQuestions(await getAllQuestionsOfAQuiz(genericQuizId));
            }
        })();
    }, [genericQuizId]);

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

    const onCreateQuestionClick = useCallback(() => {
        setIsCreatingQuestionInProgress(true);
    }, []);

    const onCancelCreateNewQuestion = useCallback(() => {
        setIsCreatingQuestionInProgress(false);
    }, []);

    const onSaveQuestion = useCallback(async (questionTitle, questionOptions) => {
        await saveQuestion(genericQuizId, questionTitle, questionOptions);
        setIsCreatingQuestionInProgress(false);
        setQuestions(await getAllQuestionsOfAQuiz(genericQuizId));
    }, [genericQuizId]);

    return (
        <>
            <LayoutSetup />
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
                <FloatingActionButton
                    title="Create question"
                    onClick={onCreateQuestionClick} />
                {isCreatingQuestionInProgress ?
                    <CreateQuestionDialog 
                        onSaveQuestion={onSaveQuestion}
                        onDismissDialog={onCancelCreateNewQuestion}/>
                    :
                    null
                }
            </main>
            <style jsx>
                {`
                    .questions {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                `}
            </style>
        </>
    )
}