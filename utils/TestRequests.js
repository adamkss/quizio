import axios from './AxiosUtils';

const getDataFromResponseAsPromise = (response) => {
    return Promise.resolve(response.data);
}

export const getAllTestsOfUser = () => {
    return axios.get('/tests').then(getDataFromResponseAsPromise);
}

export const createTest = (testName) => {
    return axios.post('/tests', {
        testName
    });
}