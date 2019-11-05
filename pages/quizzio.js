import LayoutSetup from "../components/layoutSetup"
import React from 'react';
import Router from 'next/router';

export default () => {
    const onClickCreateQuiz = React.useCallback(() => {
        Router.push('/createGenericQuiz');
    }, []);

    return (
        <>
            <LayoutSetup />
            <section className="quiz-illustration-container">
                <QuizzIllustration />
            </section>
            <main>
                <section className="entry-stuff-container">
                    <h1>Quizzio</h1>
                    <p className="subtitle">Design the most beautiful quizzes</p>
                    <button className="primary-button" onClick={onClickCreateQuiz}>
                        Create quiz now
                    </button>
                    <p>...or</p>
                    <button className="secondary-button">
                        Login
                    </button>
                </section>
            </main>
            <style jsx>
                {`
                main {
                    width: 100%;
                    height: 100vh;
                    position: relative;
                    padding-top: 30px;
                }
                main button{
                    font-family: inherit;
                    border: 0;
                    outline: none;
                    width: 200px;
                    border-radius: 12px;
                    color: white;
                    font-size: 1.15em;
                    padding: 9px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .primary-button {
                    box-shadow: 1px 1px 5px blue;
                    background-color: blue;
                    margin-top: 50px;
                }
                .primary-button:hover {
                    background-color: #0040FF;
                    box-shadow: 1px 1px 5px #0040FF;
                }
                .secondary-button {
                    margin-top: 10px;
                    background-color: #F64D72;
                    box-shadow: 1px 1px 5px #F64D72;
                }
                .secondary-button:hover {
                    background-color: #FF4D90;
                    box-shadow: 1px 1px 5px #FF4D90;
                }
                main p {
                    font-size: 1.5em;
                    margin-top: 10px;
                }
                .quiz-illustration-container {
                    position: fixed;
                    top: 0px;
                    bottom: 0px;
                    display: flex;
                    align-items: center;
                    left: -5px;
                    transform: rotate(3deg);
                    animation: QuizIllustrationIntro 0.7s ease-out;
                }
                @keyframes QuizIllustrationIntro { 
                    0% {
                        transform: rotate(0deg);
                        left: -30px;
                        opacity: 0;
                    }
                    100% {
                        transform: rotate(3deg);
                        left: -5px;
                        opacity: 1;
                    }
                }
                .entry-stuff-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    animation: SlideDownAndFadeIn 1s;
                }
                .entry-stuff-container h1 {
                    font-size: 7em;
                    font-weight: 700;
                }
                .entry-stuff-container p.subtitle  {
                    font-size: 3em;
                }
                @keyframes SlideDownAndFadeIn {
                    0% {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0px);
                        opacity: 1;
                    }
                }
            `}
            </style>
        </>
    )
}

const QuizzIllustration = () => {
    return (
        <>
            <div className="shell">
                <h1>Hard Math Question</h1>
                <SillyHandwritingWithOption text="Between 1914 - 1918" />
                <SillyHandwritingWithOption text="sin(45)" checked />
                <SillyHandwritingWithOption text="Mozart" />
            </div>
            <style jsx>
                {`
                    .shell {
                        width: 350px;
                        box-shadow: 2px 2px 13px grey;
                        border-radius: 5px;
                        padding: 30px;
                        padding-top: 20px;
                        padding-bottom: 100px;
                    }
                    h1 {
                        text-align: center;
                        font-weight: 400;
                        font-size: 2em;
                    }
            `}
            </style>
        </>
    )
}

const SillyHandwritingWithOption = ({ text, checked }) => {
    return (
        <>
            <div className="shell">
                <SillyHandwriting text={text} />
                <Checkmarkplace checked={checked} />
            </div>
            <style jsx>
                {`
                    .shell {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 60px;
                    }
            `}
            </style>
        </>
    )
}
const SillyHandwriting = ({ text = "Lorem impsum dolor" }) => {
    return (
        <>
            <span>{text}</span>
            <style jsx>
                {`
                    span {
                        font-size: 2em;
                        font-family: 'Reenie Beanie', cursive;
                    }
                `}
            </style>
        </>
    )
}

const Checkmarkplace = ({ checkmarkplaceColor = "#44318d", checked }) => {
    return (
        <>
            <div className="checkmark-place">
                {checked ?
                    <img src="/static/checkmark.svg" />
                    :
                    null
                }
            </div>
            <style jsx>
                {`
                .checkmark-place {
                    width: 50px;
                    height: 50px;
                    background-color: ${checkmarkplaceColor};
                    border-radius: 45%;
                    position: relative;
                }
                img {
                    width: 60px;
                }
            `}
            </style>
        </>
    )
}