import axios from 'axios';
const baseURL = '3.133.70.75:4000';
// const baseURL = 'http://localhost:4000';
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