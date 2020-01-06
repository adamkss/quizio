import LayoutSetup from '../components/layoutSetup';
import TextInput from '../components/TextInput';
import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { login } from '../utils/AuthUtils';
import { saveSuccessfulLoginInfo } from '../utils/AuthUtils';
import useAuthTokenIfExists from '../hooks/useAuthTokenIfExists';
import Router from 'next/router';

export default () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoginInProgress, setIsLoginInProgress] = React.useState(false);
    const [isLoginFailed, setIsLoginFailed] = React.useState(false);
    useAuthTokenIfExists({ redirectURLIfExists: '/homepage' });

    const onLoginClicked = React.useCallback(async () => {
        setIsLoginInProgress(true);
        try {
            const loginResponse = await login({ username, password });
            saveSuccessfulLoginInfo(loginResponse["access_token"]);
            setIsLoginFailed(false);
            Router.push('/homepage');
        }
        catch {
            setIsLoginFailed(true);
        }
        setIsLoginInProgress(false);
    }, [username, password]);

    return (
        <>
            <LayoutSetup />
            <main>
                <div className="login-window fade-and-slide-in">
                    <h1>Quizio</h1>
                    <form>
                        <TextInput title="E-mail:" width="100%" value={username} valueSetter={setUsername} />
                        <TextInput title="Password:" width="100%" value={password} valueSetter={setPassword} password />
                        <span className="failed-login-indicator">
                            Sorry, the credentials are wrong.
                    </span>
                    </form>
                    <PrimaryButton title="Login" centered medium marginTop onClick={onLoginClicked} />
                    <SecondaryButton title="Register" centered marginTop medium linkTo="/register" />
                </div>
            </main>
            {isLoginInProgress ?
                <LoadingSpinner />
                :
                ""
            }
            <style jsx>
                {`
                main {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                h1 {
                    padding: 0;
                    margin: 0;
                    border-bottom: 2px solid black;
                }
                .login-window {
                    width: 93%;
                    max-width: 450px;
                    min-width: 300px;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0px 0px 4px grey;
                    padding: 20px;
                    padding-top: 10px;
                    position: relative;
                }

                .login-window > form {
                    display: flex;
                    flex-direction: column;
                    padding: 50px 0px;
                    padding-bottom: 25px;
                }
                .failed-login-indicator {
                    width: 100%;
                    text-align: center;
                    color: red;
                    font-weight: 500;
                    transition: all 0.3s;
                    position: relative;
                    ${isLoginFailed ?
                        `
                        display: inline;
                        bottom: 0px;
                        opacity: 1;
                        `
                        :
                        `
                        display: hidden;
                        bottom: -10px;
                        opacity: 0;
                        `
                    }
                }
            `}
            </style>
        </>
    )
}