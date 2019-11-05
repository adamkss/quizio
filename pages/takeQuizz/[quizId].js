import React from 'react';
import Router, { useRouter } from 'next/router';
import { getNewSessionForQuiz } from '../../utils/QuizRequests';

export default () => {
    const { quizId } = useRouter().query;

    React.useEffect(() => {
        (async () => {
            if (quizId) {
                const { sessionId } = await getNewSessionForQuiz(quizId);
                Router.push(`/quiz/${sessionId}`);
            }
        })();
    }, [quizId]);

    return (
        <>
        </>
    )
}