import LayoutSetup from "../components/layoutSetup";
import React from 'react';
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";
import LoadingSpinner from '../components/LoadingSpinner';
import { registerUser } from "../utils/QuizRequests";
import SecondaryButton from "../components/SecondaryButton";
import Router from 'next/router';
import { OnEnterPressBoundary } from '../components/OnEnterPressBoundary';
import Link from "next/link";

const stepOneValidator = ({ name, email }) => {
    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email) && name != "";
}

const stepTwoValidator = ({ password, confirmedPassword }) => {
    return password !== "" && password === confirmedPassword;
}

const validators = [stepOneValidator, stepTwoValidator];

export default () => {
    const [step, setStep] = React.useState(1);
    const [isNextValid, setIsNextValid] = React.useState(false);

    const emailReactState = React.useState("");
    const nameReactState = React.useState("");
    const passwordReactState = React.useState("");
    const confirmPasswordReactState = React.useState("");
    const [isWaiting, setIsWaiting] = React.useState(false);
    const [newUser, setNewUser] = React.useState(null);

    const register = React.useCallback(async () => {
        setIsWaiting(true);
        const user = await registerUser({ name: nameReactState[0], email: emailReactState[0], password: passwordReactState[0] });
        setIsWaiting(false);
        if (user) {
            setNewUser(user);
            setStep(step => step + 1);
        }
    }, [nameReactState[0], emailReactState[0], passwordReactState[0]]);

    const onNextClick = React.useCallback(() => {
        setStep(step => step + 1);
        setIsNextValid(false);
        if (step == 2) {
            register();
        }
    }, [step, register]);

    React.useEffect(() => {
        const email = emailReactState[0];
        const password = passwordReactState[0];
        const confirmedPassword = confirmPasswordReactState[0];
        const name = nameReactState[0];

        setIsNextValid(validators[step - 1]({ name, email, password, confirmedPassword }));
    }, [nameReactState[0], emailReactState[0], passwordReactState[0], confirmPasswordReactState[0]]);

    return (
        <>
            <LayoutSetup />
            <div className="centered full-view-height small-lateral-padding">
                <div className="card fade-and-slide-in">
                    <header>
                        <Link href="/">
                            <h1>Quizio <span>registration</span></h1>
                        </Link>
                    </header>
                    <OnEnterPressBoundary onEnterPressed={isNextValid && step !== 4 ? onNextClick : null}>
                        <main>
                            <ProgressIndicator numberOfSteps={3} currentStep={step} />
                            <div className="step-container">
                                {step === 1 ?
                                    <FirstRegistrationStep
                                        nameReactState={nameReactState}
                                        emailReactState={emailReactState} />
                                    :
                                    step === 2 ?
                                        <SecondRegistrationStep
                                            passwordReactState={passwordReactState}
                                            confirmPasswordReactState={confirmPasswordReactState} />
                                        :
                                        newUser ?
                                            <ThirdRegistrationStep />
                                            :
                                            ""
                                }
                            </div>
                            {step !== 4 ?
                                <PrimaryButton
                                    onClick={isNextValid ? onNextClick : null}
                                    title="Next"
                                    rightAligned
                                    marginTop
                                    medium
                                    inactive={!isNextValid} />
                                :
                                ""
                            }
                            {isWaiting && <LoadingSpinner />}
                        </main>
                    </OnEnterPressBoundary>
                </div>
            </div>
            <img className="illustration" src="/static/illustrations/drawing-man.svg" />
            <style jsx>
                {`
                .card {
                    width: 100%;
                    height: 80vh;
                    max-height: 700px;
                    max-width: 1200px;
                    display: flex;
                    flex-direction: column;
                    border-radius: 10px;
                    box-shadow: 0px 0px 8px hsl(0, 0%, 75%);
                    background-color: white;
                }
                main,
                header {
                    padding: 20px;
                }
                main {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    padding: 32px;
                }
                .step-container {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                h1 {
                    border-bottom: 2px solid black;
                }
                h1 span {
                    font-weight: 300;
                    font-size: 0.65em;
                }
                .illustration {
                    display: none;
                    position: fixed;
                    left: -170px;
                    width: 700px;
                    top: 60%;
                    transform: translateY(-50%) rotate(-2deg);
                    z-index: -1;
                    opacity: 0.8;
                    animation: IllustrationIn 2s ease-out;
                }
                @keyframes IllustrationIn {
                    0%, 20% {
                        opacity: 0;
                        transform: translateY(-50%) rotate(0deg) translateX(-30px) scale(0.97);
                    }
                    75 % {
                        opacity: 0.3;
                    }
                    100% {
                        opacity: 0.8;
                        transform: translateY(-50%) rotate(-2deg) translateX(0px) scale(1);
                    }
                }
                @media (min-width: 1430px) {
                    .illustration {
                        display: block;
                    }
                }
            `}
            </style>
        </>
    )
}

const ProgressIndicator = ({ numberOfSteps = 3, currentStep = 2 }) => {
    return (
        <>
            <LayoutSetup />
            <div className="main-holder">
                {[...Array(numberOfSteps)].map((val, index) => {
                    const classNames = index + 1 < currentStep ? " checked" : index + 1 === currentStep ? " current" : "";
                    return (
                        <>
                            <div className={`element${classNames}`}>{index + 1}</div>
                            {index !== numberOfSteps - 1 ?
                                <div className="line" />
                                :
                                ""
                            }
                        </>
                    )
                })}
            </div>
            <style jsx>
                {`
                .main-holder {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .element {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,0,0,0.3);
                    background-color: white;
                    transition: all 1s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .element.checked {
                    background-color: #4BAC60;
                    color: white;
                }
                .element.current {
                    background-color: rgba(0, 0, 0, 0.15);
                }
                .line {
                    height: 1px;
                    width: 40px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
                }
            `}
            </style>
        </>
    )
}

const FirstRegistrationStep = ({ nameReactState, emailReactState }) => {
    return (
        <>
            <LayoutSetup />
            <div className="horizontally-centered fade-in">
                <TextInput
                    title="Name:"
                    width="100%"
                    value={nameReactState[0]}
                    valueSetter={nameReactState[1]} />
            </div>
            <div className="horizontally-centered fade-in">
                <TextInput
                    title="E-mail:"
                    width="100%"
                    value={emailReactState[0]}
                    valueSetter={emailReactState[1]} />
            </div>
            <style jsx>
                {`
            `}
            </style>
        </>
    )
}

const SecondRegistrationStep = ({ passwordReactState, confirmPasswordReactState }) => {
    return (
        <>
            <LayoutSetup />
            <div className="horizontally-centered-vertical fade-in">
                <TextInput
                    password
                    title="Password:"
                    width="100%"
                    value={passwordReactState[0]}
                    valueSetter={passwordReactState[1]} />
                <TextInput
                    password
                    title="Confirm password:"
                    width="100%"
                    value={confirmPasswordReactState[0]}
                    valueSetter={confirmPasswordReactState[1]} />
            </div>
            <style jsx>
                {`
            `}
            </style>
        </>
    )
}

const ThirdRegistrationStep = ({ }) => {
    return (
        <>
            <LayoutSetup />
            <div className="horizontally-centered-vertical fade-in">
                <img className="fade-and-slide-in" src="/static/check_circle-24px.svg" />
                <span className="fade-in">You registered successfully!</span>
                <SecondaryButton
                    title="Login"
                    marginTop
                    onClick={React.useCallback(() => {
                        Router.push('/login');
                    }, [])}
                />
            </div>
            <style jsx>
                {`
                    div {
                        margin-top: 20px;
                    }
                    img {
                        width: 100px;
                    }
                    span {
                        font-size: 1.2em;
                    }
            `}
            </style>
        </>
    )
}