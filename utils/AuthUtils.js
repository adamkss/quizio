import axios, { setAuthToken } from './AxiosUtils';

const getDataFromResponseAsPromise = (response) => {
    return Promise.resolve(response.data);
}

export const login = ({ username, password }) => {
    return axios.post('/auth/login', { username, password }).then(getDataFromResponseAsPromise);
}

export const saveSuccessfulLoginInfo = (accessToken) => {
    window.sessionStorage.setItem('accessToken', accessToken);
    setAuthToken(accessToken);
}

export const getCurrentToken = () => {
    return window.sessionStorage.getItem('accessToken');
}

export const clearToken = () => {
    window.sessionStorage.removeItem('accessToken');
}

export const verifyIfTokenValid = async () => {
    try {
        await axios.get('/profile');
        return true;
    } catch (error) {
        if (error.response.status === 401) {
            localStorage.setItem(LOGIN_EXPIRED_PERSISTENT_STORAGE_KEY, 'true');
        }
        return false;
    }
}

export const LOGIN_EXPIRED_PERSISTENT_STORAGE_KEY = 'loginExpired';

export const isSessionTimedOut = () => {
    return localStorage.getItem(LOGIN_EXPIRED_PERSISTENT_STORAGE_KEY) === 'true';
}

export const resetIsSessionTimedOut = () => {
    localStorage.setItem(LOGIN_EXPIRED_PERSISTENT_STORAGE_KEY, 'false');
}