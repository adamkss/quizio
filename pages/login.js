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
import { OnEnterPressBoundary } from '../components/OnEnterPressBoundary';

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
                    <OnEnterPressBoundary onEnterPressed={onLoginClicked}>
                        <form>
                            <TextInput title="E-mail:" width="100%" value={username} valueSetter={setUsername} />
                            <TextInput title="Password:" width="100%" value={password} valueSetter={setPassword} password />
                            <span className="failed-login-indicator">
                                Sorry, the credentials are wrong.
                        </span>
                        </form>
                    </OnEnterPressBoundary>
                    <PrimaryButton title="Login" centered medium marginTop onClick={onLoginClicked} />
                    <SecondaryButton title="Register" centered marginTop medium linkTo="/register" />
                </div>
            </main>
            <img className="illustration" src="/static/illustrations/drawkit-notebook-man-monochrome.svg" />
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
                    max-width: 550px;
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
                    padding-top: 20px;
                }
                @media (min-height: 650px) {
                    .login-window > form {
                        padding: 25px 0px;
                    }
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
                .illustration {
                    position: fixed;
                    width: 400px;
                    right: -50px;
                    bottom: -230px;
                    transform: rotate(-12deg);
                    z-index: -1;
                    opacity: 0.8;
                    transition: all 0.3s;
                    animation: IllustrationIn 1s ease-out;
                }
                @keyframes IllustrationIn {
                    0%, 50% {
                        opacity: 0;
                        transform: translate(-30px, -10px) scale(1.025) rotate(-12deg);
                    }
                    100% {
                        opacity: 0.8;
                        transform: translate(0px, 0px) scale(1) rotate(-12deg);
                    }
                }
                @media (min-width: 768px) {
                    .illustration {
                        width: 500px;
                    }
                }
                @media (min-width: 1300px) {
                    .illustration {
                        width: 600px;
                    }
                }
                @media (min-height: 750px) {
                    .illustration {
                        bottom: -130px;
                    }
                }
            `}
            </style>
        </>
    )
}