import axios from './AxiosUtils';

const getDataFromResponseAsPromise = (response) => {
    return Promise.resolve(response.data);
}

export const getUserDetails = () => {
    axios.get('/profile').then(getDataFromResponseAsPromise);
}