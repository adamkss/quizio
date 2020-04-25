import axios from 'axios';
//to be changed
const baseURL = 'https://quizio.org/api';
axios.defaults.baseURL = baseURL;

export const setAuthToken = (accessToken) => {
    axios.defaults.headers.common = {'Authorization' : `Bearer ${accessToken}`};
}

export const setupInitialToken = () => {
    const accessToken = window.sessionStorage.getItem('accessToken');
    if(accessToken) {
        setAuthToken(accessToken);
        return true;
    }
    return false;
}

export default axios;