import axios from './AxiosUtils';

const getDataFromResponseAsPromise = (response) => {
    return Promise.resolve(response.data);
}

export const getAllCourses = () => {
    return axios.get('/courses').then(getDataFromResponseAsPromise);
}

export const createCourse = (courseName) => {
    return axios.post('/courses', {
        courseName
    }).then(getDataFromResponseAsPromise);
}

export const getQuizesForCourse = (courseId) => {
    return axios.get(`/courses/${courseId}/quizes`).then(getDataFromResponseAsPromise);
}

export const getAllQuestionsOfAQuiz = (quizId) => {
    return axios.get(`/quizzes/${quizId}/questions`).then(getDataFromResponseAsPromise);
}

export const getNewSessionForQuiz = quizId => {
    return axios.post(`/quiz-sessions/by-quizzes/${quizId}`).then(getDataFromResponseAsPromise);
}

export const getNextQuizQuestion = (sessionId) => {
    return axios.get(`/quiz-sessions/${sessionId}/nextQuestion`);
}

export const verifyAnswer = (sessionId, questionId, answerId) => {
    return axios.post(`/quiz-sessions/${sessionId}/clientAnswers`, {
        questionId,
        answerId
    })
}

export const saveQuestion = (quizId, questionTitle, questionOptions, rightAnswer = "") => {
    return axios.post(`/quizzes/${quizId}/questions`, {
        questionTitle,
        options: questionOptions,
        rightAnswer
    });
}

export const addOptionToQuestion = (questionId, questionOption) => {
    return axios.post(`/questions/${questionId}/questionOptions`, {
        questionOption
    }).then(getDataFromResponseAsPromise)
}

export const setNewAnswerOptionAsCorrectAnswer = (questionId, newCorrectQuestionOptionId) => {
    return axios.put(`/questions/${questionId}/rightAnswer`, {
        newCorrectQuestionOptionId
    }).then(getDataFromResponseAsPromise);
}

export const deleteQuestionOptionFromQuestion = (questionId, questionOptionId) => {
    return axios.delete(`/questions/${questionId}/questionOptions/${questionOptionId}`).then(getDataFromResponseAsPromise);
}

export const deleteQuestion = (questionId) => {
    return axios.delete(`/questions/${questionId}`);
}

export const createNewQuiz = (courseId, quizName) => {
    return axios.post(`/courses/${courseId}/quizzes`, { quizName })
        .then(getDataFromResponseAsPromise);
}

export const deleteQuiz = async (quizId) => {
    const res = await axios.delete(`/quizzes/${quizId}`);
    return res.status === 204;
}

export const createNewGenericQuizz = (quizzName) => {
    return axios.post(`/genericQuizzes`, {
        newQuizName: quizzName
    }).then(getDataFromResponseAsPromise);
}

export const getStatisticsForQuizSession = (sessionId) => {
    return axios.get(`/quiz-sessions/${sessionId}/statistics`).then(getDataFromResponseAsPromise);
}

export const registerUser = ({ email, password }) => {
    return axios.post('/register', { email, password }).then(getDataFromResponseAsPromise);
}

export const getQuizzesOfCurrentUser = () => {
    return axios.get('/genericQuizzes/myQuizzes').then(getDataFromResponseAsPromise);
}

export const getQuizInfoById = (quizId) => {
    return axios.get(`/genericQuizzes/${quizId}`).then(getDataFromResponseAsPromise);
}

export const updateQuizSettings = (quizId, { quizName, askForQuiztakerName, showResultAtEndOfQuiz }) => {
    return axios.put(`/genericQuizzes/${quizId}/settings`, {
        quizName,
        askForQuiztakerName,
        showResultAtEndOfQuiz
    }).then(getDataFromResponseAsPromise);
}