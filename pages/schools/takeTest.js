import React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import LayoutSetup from '../../components/layoutSetup';
import PrimaryButton from '../../components/PrimaryButton';
import TextInput from '../../components/TextInput';
import { createSessionByEntryCode } from '../../utils/TestRequests';
import { executeAsyncFunctionAndObserveState } from '../../utils/AsyncUtils';
import Router from 'next/router';
import Link from 'next/link';

export default () => {
    const [isLoadingScreenShown, setIsLoadingScreenShown] = React.useState(false);
    const [entryCode, setEntryCode] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState(null);

    const onGoClick = React.useCallback(async () => {
        const result = await executeAsyncFunctionAndObserveState(
            setIsLoadingScreenShown,
            createSessionByEntryCode,
            entryCode
        );
        if (result.statusCode == 200) {
            Router.push(`/schools/doTest/${result.body.sessionId}`)
        } else {
            setErrorMessage(result.body.error || 'Something went wrong.');
        }
    }, [entryCode, Router]);

    return (
        <>
            <LayoutSetup />
            {isLoadingScreenShown ?
                <LoadingSpinner />
                :
                ""
            }
            <main>
                <section className="card fade-and-slide-in">
                    <h1>Ready to take the test?</h1>
                    <TextInput
                        title="Entry code:"
                        width="100%"
                        marginTop="15px"
                        value={entryCode}
                        valueSetter={setEntryCode}
                    />
                    <PrimaryButton
                        title="Go!"
                        rightAligned
                        medium
                        marginTop
                        onClick={onGoClick}
                        inactive={!entryCode}
                    />
                    {errorMessage ?
                        <p className="error-message">{errorMessage}</p>
                        :
                        null
                    }
                </section>
            </main>

            <img className="illustration" src="/static/illustrations/student-monochrome.svg" />
            <a href="/schools" className="title fade-in">
                Quizio Schools
            </a>
            <style jsx>
                {`
                    main {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-size: 1.2rem;
                    }
                    .card {
                        width: 80%;
                        max-width: 600px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 8px hsl(0, 0%, 70%);
                        padding: 30px;
                        margin-top: -90px;
                        background-color: white;
                    }
                    h1 {
                        font-weight: 400;
                    }
                    .card__quiz-name {
                        font-weight: 700;
                    }
                    .illustration {
                        width: 200px;
                        position: fixed;
                        bottom: -40px;
                        left: 50%;
                        transform: translateX(-50%);
                        opacity: 0.8;
                        z-index: -1;
                        animation: IllustrationIn 1.8s ease-out;
                    }
                    @media (min-width: 400px) {
                        .illustration {
                            width: 250px;
                        }
                    }
                    @media (min-width: 700px) {
                        .illustration {
                            width: 350px;
                            bottom: -75px;
                        }
                    }
                    @keyframes IllustrationIn {
                        0% {
                            opacity: 0;
                            transform: translateX(-50%) translateY(-10px);
                        }
                        40% {
                            opacity: 0;
                        }
                        75% {
                            opacity: 0.4;
                        }
                        100% {
                            opacity: 0.8;
                            transform: translateX(-50%) translateY(0px);
                        }
                    }
                    .title {
                        position: fixed;
                        top: 10px;
                        font-weight: 500;
                        left: 50%;
                        transform: translateX(-50%);
                        outline: none;
                        text-decoration: none;
                        color: black;
                        font-size: 2rem;
                    }
                    @media (min-width: 450px) {
                        .title {
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                `}
            </style>
        </>
    )
}