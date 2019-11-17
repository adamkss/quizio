import LayoutSetup from "../components/layoutSetup";
import React from 'react';
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";

const stepOneValidator = ({email, password, confirmedPassword}) => {
    return email !== "";
}

const stepTwoValidator = ({email, password, confirmedPassword}) => {
    return password !== "" && password === confirmedPassword;
}

const validators = [stepOneValidator, stepTwoValidator];

export default () => {
    const [step, setStep] = React.useState(1);
    const [isNextValid, setIsNextValid] = React.useState(false);

    const emailReactState = React.useState("");
    const passwordReactState = React.useState("");
    const confirmPasswordReactState = React.useState("");

    const onNextClick = React.useCallback(() => {
        setStep(step => step + 1);
        setIsNextValid(false);
    }, []);

    React.useEffect(() => {
        const email = emailReactState[0];
        const password = passwordReactState[0];
        const confirmedPassword = confirmPasswordReactState[0];

        setIsNextValid(validators[step - 1]({email, password, confirmedPassword}));
    }, [emailReactState[0], passwordReactState[0], confirmPasswordReactState[0]]);

    return (
        <>
            <LayoutSetup />
            <header>
                <h1>Quizio <span>registration</span></h1>
            </header>
            <main>
                <ProgressIndicator numberOfSteps={3} currentStep={step} />
                {step === 1 ?
                    <FirstRegistrationStep emailReactState={emailReactState} />
                    :
                    step === 2 ?
                        <SecondRegistrationStep
                            passwordReactState={passwordReactState}
                            confirmPasswordReactState={confirmPasswordReactState} />
                        :
                        ""
                }
                <PrimaryButton
                    onClick={isNextValid ? onNextClick : null}
                    title="Next"
                    rightAligned
                    marginTop
                    inactive={!isNextValid} />
            </main>
            <style jsx>
                {`
                main,
                header {
                    padding: 20px;
                }
                main {
                    padding-top: 0px;
                }
                h1 {
                    border-bottom: 2px solid black;
                }
                h1 span {
                    font-weight: 300;
                    font-size: 0.65em;
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

const FirstRegistrationStep = ({ emailReactState }) => {
    return (
        <>
            <LayoutSetup />
            <TextInput
                title="E-mail:"
                width="100%"
                value={emailReactState[0]}
                valueSetter={emailReactState[1]} />
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
            <style jsx>
                {`
            `}
            </style>
        </>
    )
}