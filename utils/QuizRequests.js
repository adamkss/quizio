import axios from 'axios';
const baseURL = 'http://localhost:4000';

axios.defaults.baseURL = baseURL;

const getDataFromResponseAsPromise = (response) => {
    return Promise.resolve(response.data);
}

export const getAllCourses = () => {
    return axios.get('/courses').then(getDataFromResponseAsPromise);
}

export const getQuizesForCourse = (courseId) => {
    return axios.get(`/courses/${courseId}/quizes`).then(getDataFromResponseAsPromise);
}

export const getAllQuestionsOfAQuiz = (quizId) => {
    return axios.get(`/courses/quizes/${quizId}/questions`).then(getDataFromResponseAsPromise);
}

export const getNextQuizQuestion = (quizId) => {
    return axios.get(`/quiz/${quizId}/nextQuestion`);
}

export const verifyAnswer = (quizId, questionId, answerId) => {
    return axios.post(`/quiz/${quizId}/addClientAnswer`, {
        questionId,
        answerId
    })
}

export const saveQuestion = (quizId, questionTitle, questionOptions, rightAnswer) => {
    console.log(quizId, questionTitle, questionOptions, rightAnswer)
    return axios.post(`/courses/quizes/${quizId}/questions`, {
        questionTitle,
        options: questionOptions,
        rightAnswer
    });
}

export const addOptionToQuestion = (questionId, questionOption) => {
    return axios.post(`/courses/questions/${questionId}/questionOptions`, {
        questionOption
    }).then(getDataFromResponseAsPromise)
}