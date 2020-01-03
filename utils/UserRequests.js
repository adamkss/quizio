import axios from './AxiosUtils';

const getDataFromResponseAsPromise = (response) => {
    return Promise.resolve(response.data);
}

export const getUserDetails = () => {
    return axios.get('/profile').then(getDataFromResponseAsPromise);
}