import axios from 'axios';
const baseURL = 'http://ec2-18-221-120-157.us-east-2.compute.amazonaws.com:4000';
// const baseURL = 'http://localhost:4000';

axios.defaults.baseURL = baseURL;

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
    return axios.post(`/courses/${courseId}/quizzes`, {quizName})
        .then(getDataFromResponseAsPromise);
}

export const deleteQuiz = async (courseId, quizId) => {
    const res = await axios.delete(`/quizzes/${quizId}`);
    return res.status === 204;
}

export const createNewGenericQuiz = (quizName) => {
    return axios.post(`/genericQuizzes`, {
        newQuizName: quizName
    }).then(getDataFromResponseAsPromise);
}