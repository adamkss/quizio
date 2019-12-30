import React from 'react';
import Router, { useRouter } from 'next/router';
import { getNewSessionForQuiz, getQuizInfoById } from '../../utils/QuizRequests';
import LoadingSpinner from '../../components/LoadingSpinner';
import { executeAsyncFunctionAndObserveState } from '../../utils/AsyncUtils';
import LayoutSetup from '../../components/layoutSetup';
import PrimaryButton from '../../components/PrimaryButton';
import TextInput from '../../components/TextInput';

export default () => {
    const { quizId } = useRouter().query;
    const [isLoadingScreenShown, setIsLoadingScreenShown] = React.useState(false);
    const [quiz, setQuiz] = React.useState(null);
    const [quizTakerName, setQuizTakerName] = React.useState("");

    React.useEffect(() => {
        (async () => {
            if (quizId) {
                const quiz = await executeAsyncFunctionAndObserveState(
                    setIsLoadingScreenShown,
                    getQuizInfoById,
                    quizId
                );
                setQuiz(quiz);
            }
        })();
    }, [quizId]);

    const requestSessionForQuiz = React.useCallback(async () => {
        if (quizId) {
            const { sessionId } = await executeAsyncFunctionAndObserveState(
                setIsLoadingScreenShown,
                getNewSessionForQuiz,
                quizId,
                {
                    quizTakerName
                }
            );
            Router.push(`/quiz/${sessionId}`);
        }
    }, [quizId, quizTakerName]);

    const onGoClick = React.useCallback(() => {
        requestSessionForQuiz();
    }, [requestSessionForQuiz]);

    return (
        <>
            <LayoutSetup />
            {isLoadingScreenShown ?
                <LoadingSpinner />
                :
                ""
            }
            {quiz ?
                <main>
                    <section className="card fade-and-slide-in">
                        <h1>Ready to take quiz "<span className="card__quiz-name">{quiz.name}</span>" ?</h1>
                        {quiz.askForQuizTakerName ?
                            <TextInput
                                title="Your name:"
                                width="100%"
                                marginTop="15px"
                                value={quizTakerName}
                                valueSetter={setQuizTakerName}
                            />
                            :
                            ""
                        }
                        <PrimaryButton
                            title="Go!"
                            rightAligned
                            medium
                            inactive={quiz.askForQuizTakerName && quizTakerName === ""}
                            onClick={onGoClick}
                        />
                    </section>
                </main>
                :
                ""
            }
            <style jsx>
                {`
                    main {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .card {
                        width: 80%;
                        max-width: 600px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 8px hsl(0, 0%, 70%);
                        padding: 30px;
                    }
                    h1 {
                        font-weight: 400;
                    }
                    .card__quiz-name {
                        font-weight: 700;
                    }
                `}
            </style>
        </>
    )
}