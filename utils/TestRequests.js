import axios from "./AxiosUtils";

const getDataFromResponseAsPromise = (response) => {
  return Promise.resolve(response.data);
};

const getDataAndStatusFromResponseAsPromise = (response) => {
  return Promise.resolve({
    body: response.data,
    statusCode: response.status,
  });
};

export const getAllTestsOfUser = () => {
  return axios.get("/tests").then(getDataFromResponseAsPromise);
};

export const createTest = (testName) => {
  return axios.post("/tests", {
    testName,
  });
};

export const getTestById = (testId) => {
  return axios.get(`/tests/${testId}`).then(getDataFromResponseAsPromise);
};

export const getAllQuestionsOfTest = (testId) => {
  return axios
    .get(`/tests/${testId}/questions`)
    .then(getDataFromResponseAsPromise);
};

export const getQuestionOfTest = (questionId) => {
  return axios
    .get(`/tests/questions/${questionId}`)
    .then(getDataFromResponseAsPromise);
};

export const createQuestion = (
  testId,
  questionText,
  initialQuestionOptions
) => {
  return axios
    .post(`/tests/${testId}/questions`, {
      questionText,
      initialQuestionOptions,
    })
    .then(getDataFromResponseAsPromise);
};

export const addQuestionOptionToQuestion = (questionId, questionOptionText) => {
  return axios
    .post(`/tests/questions/${questionId}/options`, {
      questionOptionText,
    })
    .then(getDataFromResponseAsPromise);
};

export const updateCorrectQuestionOption = (
  questionId,
  newCorrectQuestionOptionId
) => {
  return axios
    .put(`/tests/questions/${questionId}/correctOption`, {
      questionOptionId: newCorrectQuestionOptionId,
    })
    .then(getDataFromResponseAsPromise);
};

export const deleteQuestionOption = (questionOptionId) => {
  return axios.delete(`/tests/question-options/${questionOptionId}`);
};

export const deleteQuestion = (questionId) => {
  return axios.delete(`/tests/questions/${questionId}`);
};

export const moveQuestions = (testId, sourceIndex, targetIndex) => {
  return axios.put(`/tests/${testId}/questionOrders`, {
    sourceIndex,
    targetIndex,
  });
};

export const createNewEntryCodes = (testId, numberOfNewEntryCodes) => {
  return axios
    .post(`/tests/${testId}/entryCodes`, { numberOfNewEntryCodes })
    .then(getDataFromResponseAsPromise);
};

export const updateEntryCodeName = (testId, entryCodeId, newName) => {
  return axios.put(`/tests/${testId}/entryCodes/${entryCodeId}/name`, {
    newName,
  });
};

export const getAllUnfinishedEntryCodesOfATest = (testId) => {
  return axios
    .get(`/tests/${testId}/entryCodes/unfinished`)
    .then(getDataFromResponseAsPromise);
};

export const getAllFinishedEntryCodesOfATest = (testId) => {
  return axios
    .get(`/tests/${testId}/entryCodes/finished`)
    .then(getDataFromResponseAsPromise);
};

export const createSessionByEntryCode = (entryCode) => {
  return axios
    .post(`/test-sessions/by-entry-codes/${entryCode}`, null, {
      validateStatus: false,
    })
    .then(getDataAndStatusFromResponseAsPromise);
};

export const getNumberOfQuestions = (sessionId) => {
  return axios
    .get(`/test-sessions/${sessionId}/numberOfQuestions`)
    .then(getDataFromResponseAsPromise);
};

export const getSessionQuestionsWithIds = (sessionId) => {
  return axios
    .get(`/test-sessions/${sessionId}/questionsWithIdsOnly`)
    .then(getDataFromResponseAsPromise);
};

export const getQuestionDetails = (sessionId, questionId) => {
  return axios
    .get(`/test-sessions/${sessionId}/questions/${questionId}`)
    .then(getDataFromResponseAsPromise);
};

export const getInfoAboutTestBySession = (sessionId) => {
  return axios
    .get(`/test-sessions/${sessionId}/testInfo`)
    .then(getDataFromResponseAsPromise);
};

export const submitTestSession = (sessionId, testQuestionsState) => {
  return axios
    .post(`/test-sessions/${sessionId}/submissions`, testQuestionsState)
    .then(getDataFromResponseAsPromise);
};

export const updateTestSettings = (testId, testSettings) => {
  return axios.put(`/tests/${testId}/settings`, testSettings);
};

export const searchUnfinishedEntryCodes = (testId, searchTerm) => {
  return axios
    .get(
      `/elastic-search/unfinished-entry-codes?testId=${testId}&searchTerm=${searchTerm}`
    )
    .then(getDataFromResponseAsPromise);
};

export const searchFinishedEntryCodes = (testId, searchTerm) => {
  return axios
    .get(
      `/elastic-search/finished-entry-codes?testId=${testId}&searchTerm=${searchTerm}`
    )
    .then(getDataFromResponseAsPromise);
};

export const getExportedPDFFinishedCodesURL = (testId) => {
  return axios
    .post(`/tests/${testId}/entryCodes/finished/exportedPDFs`)
    .then(getDataFromResponseAsPromise);
};
