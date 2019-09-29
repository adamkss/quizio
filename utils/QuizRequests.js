import axios from 'axios';
const baseURL = 'http://localhost:4000';

axios.defaults.baseURL = baseURL;

export const getNextQuizQuestion = (quizId) => {
   return axios.get(`/quiz/${quizId}/nextQuestion`);
}

export const verifyAnswer = (quizId, questionId, answerId) => {
   return axios.post(`/quiz/${quizId}/addClientAnswer`, {
       questionId,
       answerId
   })
}