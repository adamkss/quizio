import React from 'react';
import { QuizzesLayoutWrapper } from '../../../components/quizzes/QuizzesLayoutWrapper';
import { useRouter } from 'next/router';
import { getQuizInfoById, getQuizResults } from '../../../utils/QuizRequests';
import { executeAsyncFunctionAndObserveState } from '../../../utils/AsyncUtils';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default () => {
    const { genericQuizId } = useRouter().query;
    const [quiz, setQuiz] = React.useState({});
    const [isLoadingScreenActive, setIsLoadingScreenActive] = React.useState(false);
    const [quizResults, setQuizResults] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            if (genericQuizId) {
                const quiz = await executeAsyncFunctionAndObserveState(
                    setIsLoadingScreenActive,
                    getQuizInfoById,
                    genericQuizId
                );
                setQuiz(quiz);
                const quizResults = await executeAsyncFunctionAndObserveState(
                    setIsLoadingScreenActive,
                    getQuizResults,
                    genericQuizId
                );
                setQuizResults(quizResults);
            }
        })();
    }, [genericQuizId]);
    return (
        <>
            <QuizzesLayoutWrapper extraParamFromChild={quiz.name}>
                {isLoadingScreenActive ?
                    <LoadingSpinner />
                    :
                    ""
                }
                {quiz.name ?
                    <main>
                        <h1>Results of quiz "<span>{quiz.name}" :</span></h1>
                        <div className="list">
                            {quizResults.map(quizResult =>
                                <div className="list__element" key={quizResult.id}>
                                    <span>{quizResult.quizTakerName}</span>
                                    <span>{quizResult.date}</span>
                                    <span>{quizResult.result}%</span>
                                </div>
                            )}
                        </div>
                    </main>
                    :
                    ""
                }
            </QuizzesLayoutWrapper>
            <style jsx>
                {`
                    main {
                        padding: 15px;
                    }
                    h1 {
                        font-weight: 300;
                        margin-bottom: 20px;
                    }
                    h1 span {
                        font-weight: 500;
                    }
                    .list {
                        max-width: 800px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 8px hsl(0, 0%, 75%);
                    }
                    .list__element {
                        width: 100%;
                        height: 60px;
                        padding: 0px 16px;
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr; 
                        align-items: center;
                        justify-items: center;
                        border-bottom: 1px solid hsl(0, 0%, 85%);
                    }
                    .list__element > span {
                        font-size: 1em;
                    }
                    .list__element:first-child {
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }
                    .list__element:last-child {
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
            `}
            </style>
        </>
    )
}