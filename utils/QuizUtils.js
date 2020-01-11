import { assignAnonymousQuizToUser } from "./QuizRequests";

export const assignAnonymousQuizToUserIfNeeded = async () => {
    const anonymousQuizToAssign = sessionStorage.getItem('anonymousQuizToAssignToUser');
    if (anonymousQuizToAssign) {
        await assignAnonymousQuizToUser(JSON.parse(anonymousQuizToAssign).genericQuizId);
        sessionStorage.removeItem('anonymousQuizToAssignToUser');
        sessionStorage.setItem('quizToContinueOnWorking', anonymousQuizToAssign);
    }
}