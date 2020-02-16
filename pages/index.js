import LayoutSetup from "../components/layoutSetup"
import React, { useRef, useEffect, useState } from 'react';
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import { SillyHandwritingWithOption } from '../components/visual/SillyHandwriting';
import { QuizioIllustrationMain } from "../components/visual/QuizioIllustrationMain";
import Link from "next/link";

export default () => {
    const mainContentRef = useRef(null);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

    useEffect(() => {
        const scrollEventListener = () => {
            const scrollTop = mainContentRef.current.scrollTop;
            if (scrollTop >= 50) {
                setIsHeaderSticky(true);
            } else {
                setIsHeaderSticky(false);
            }
        };

        mainContentRef.current.addEventListener('scroll', scrollEventListener);
        return () => {
            mainContentRef.current.removeEventListener('scroll', scrollEventListener);
        }
    }, []);

    return (
        <>
            <LayoutSetup />
            <header className={`${isHeaderSticky ? "sticky" : ""}`}>
                <h1>Quizio</h1>
                <nav>
                    <ul>
                        <li><a href="#head">Home</a></li>
                        <li><a href="#quizio-presentation">The flow</a></li>
                        <li><a href="#about-us">About us</a></li>
                        <li><Link href="/schools"><a>Quizio Schools</a></Link></li>
                        <li><Link href="/login"><a>Login</a></Link></li>
                    </ul>
                </nav>
            </header>
            <main ref={mainContentRef}>
                <section id="head" className="head">
                    <div className="entry-stuff-container">
                        <h1>Quizio</h1>
                        <p className="subtitle">Design the most beautiful quizzes</p>
                        <PrimaryButton
                            title="Create quiz now"
                            big
                            growWithScreenSize
                            color="blue"
                            extraMarginTop
                            linkTo="/createGenericQuiz"
                        />
                        <p>...or</p>
                        <PrimaryButton
                            title="Login"
                            big
                            growWithScreenSize
                            color="pink"
                            linkTo="/login"
                            marginTop />
                        <SecondaryButton
                            title="Register"
                            marginTop
                            big
                            growWithScreenSize
                            linkTo='/register'
                        />
                    </div>
                    <div className="quiz-illustration-container">
                        <QuizzIllustration />
                    </div>
                    <div className="quizio-schools-teaser-big">
                        <img className="quizio-schools-teaser-big__icon" src="/static/book-icon.svg" />
                        <div className="quizio-schools-teaser-big__content">
                            <p>Explore <span>Quizio Schools.</span></p>
                            <p>Create tests quick and easy.</p>
                            <PrimaryButton
                                title="Go to Quizio Schools"
                                color="purple"
                                big
                                marginTop
                                linkTo="/schools" />
                        </div>
                    </div>
                </section>
                <div className="quizio-schools-teaser-container">
                    <div className="quizio-schools-teaser">
                        <p className="quizio-schools-teaser__text">
                            Explore <span>Quizio Schools</span>
                        </p>
                        <PrimaryButton
                            title="Go to Quizio Schools"
                            color="purple"
                            big
                            growWithScreenSize
                            marginTop
                        />
                    </div>
                </div>
                <section id="quizio-presentation" className="quizio-presentation">
                    <QuizioIllustrationMain />
                </section>
                <section id="about-us" className="about-us-container">
                    <h1>About us</h1>
                    <span className="about__quizio-title">Quizio</span>
                    <span className="about__quizio-subtitle">making quizzes beautiful since 2020</span>
                </section>
                <footer>
                    <span>Quizio - 2020</span>
                    <div className="footer__links">
                        <Link href="/#head">
                            <a>Home</a>
                        </Link>
                        <Link href="/#quizio-presentation">
                            <a>The flow</a>
                        </Link>
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </div>
                </footer>
                {!isHeaderSticky ?
                    <a className="go-down" href="/#quizio-presentation" title="Scroll">
                        <img className="down-arrow" src="/static/arrow.svg" />
                    </a>
                    :
                    ""
                }
            </main>

            <style jsx>
                {`
                header {
                    display: flex;
                    height: 50px;
                    transition: all 0.3s;
                    align-items: center;
                }
                header h1 {
                    flex-grow: 1;
                    padding-left: 10px;
                    transition: all 0.3s;
                    opacity: 0;
                    font-size: 1.4em;
                }
                header.sticky h1 {
                    opacity: 1;
                }
                header.sticky {
                    box-shadow: 0px 0px 12px hsl(0, 0%, 70%);
                }
                nav ul {
                    display: flex;
                }
                nav li {
                    padding: 2px;
                    list-style-type: none;
                    font-size: 1em;
                    margin-right: 5px;
                }
                nav a {
                    color: inherit;
                    text-decoration: none;
                }
                @media(min-width: 400px) {
                    nav li {
                        font-size: 1.2em;
                        margin-right: 10px;
                    }
                }
                @media (min-width: 1000px) {
                    nav li {
                        font-size: 1.4em;
                    }
                }
                @media (min-width: 1500px) {
                    nav li {
                        font-size: 1.5em;
                    }
                }
                main {
                    width: 100%;
                    height: calc(100vh - 50px);
                    position: relative;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                main p {
                    font-size: 1.5em;
                    margin-top: 10px;
                }
                .head {
                    position: relative;
                    padding-bottom: 30px;
                }
                .quiz-illustration-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transform: rotate(3deg);
                    margin-top: 50px;
                    animation: QuizIllustrationIntro 0.7s ease-out;
                }
                @media (min-width: 1195px) {
                    .quiz-illustration-container {
                        position: absolute;
                        top: 0px;
                        bottom: 0px;
                        margin-top: 0px;
                        left: -5px;
                    }
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
                .quizio-schools-teaser-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .quizio-schools-teaser {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    padding: 24px 15px;
                    margin-bottom: 30px;
                    background-color: hsl(347,88%,96%);
                    border-radius: 10px;
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 30%);
                }
                .quizio-schools-teaser__text {
                    text-align: center;
                    color: black;
                    font-weight: 400;
                    font-size: 1.6rem;
                }
                .quizio-schools-teaser__text > span {
                    font-weight: 700;
                    font-size: 1.8rem;
                }
                @media (min-width: 450px) {
                    .quizio-schools-teaser {
                        padding: 24px 20px;
                    }
                    .quizio-schools-teaser__text {
                        font-size: 1.8rem;
                    }
                    .quizio-schools-teaser__text > span {
                        font-size: 2rem;
                    }
                }
                @media (min-width: 1195px) {
                    .quizio-schools-teaser-container {
                        display: none;
                    }
                }
                .quizio-schools-teaser-big {
                    display: none;
                    flex-direction: row;
                    align-items: center;
                    position: absolute;
                    top: 20%;
                    right: -300px;
                    background-color: hsl(347,88%,96%);
                    width: 400px;
                    height: 300px;
                    border-top-left-radius: 200px;
                    border-bottom-left-radius: 200px;
                    box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.3);
                    transition: all 0.3s ease-out;
                    padding-left: 18px;
                    animation: BigTeaserIn 1s;
                }
                @keyframes BigTeaserIn {
                    0% {
                        right: -400px;
                        opacity: 0;
                    }
                    100% {
                        right: -300px;
                        opacity: 1;
                    }
                }
                .quizio-schools-teaser-big__icon {
                    width: 60px;
                    animation: Pulsate 1s ease-out;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                }
                .quizio-schools-teaser-big__content span {
                    font-size: 1.8rem;
                    font-weight: 600;
                }
                @keyframes Pulsate {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(1.1);
                    }
                }
                .quizio-schools-teaser-big:hover {
                    right: 0px;
                }
                .quizio-schools-teaser-big__content {
                    margin-left: 25px;
                }
                @media (min-width: 1195px) {
                    .quizio-schools-teaser-big {
                        display: flex;
                    }
                }
                .entry-stuff-container {
                    width: 100%;
                    height: calc(100vh - 50px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 20px;
                    animation: SlideDownAndFadeIn 1s;
                }
                .entry-stuff-container h1 {
                    font-size: 7em;
                    font-weight: 700;
                }
                @media (min-width: 1000px) {
                    .entry-stuff-container h1 {
                        font-size: 8.2em;
                    }
                }
                @media (min-width: 1400px) {
                    .entry-stuff-container h1 {
                        font-size: 9em;
                    }
                }
                .entry-stuff-container p.subtitle  {
                    font-size: 3em;
                    text-align: center;
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
                .quizio-presentation {
                    margin-top: 25px;
                    min-height: calc(100vh - 25px);
                    background-color: hsl(347,90%,97%);
                    clip-path: polygon(50% 0%, 100% 30px, 100% 100%, 0 100%, 0 30px);
                    padding-bottom: 20px;
                }
                .about-us-container {
                    width: 100%;
                    height: 100vh;
                    clip-path: polygon(50% 0%, 100% 30px, 100% 100%, 0 100%, 0 30px);
                    background-color: #43318D;
                    margin-top: -30px;
                    padding: 30px;
                    padding-top: 50px;
                    color: white;
                    font-size: 1.2em;
                }
                .about-us-container h1 {
                    text-decoration: underline;
                }
                .about__quizio-title {
                    display: block;
                    width: 100%;
                    color: transparent;
                    text-align: center;
                    font-size: 7em;
                    margin-top: 40px;
                    -webkit-text-stroke: 3px yellow;
                }
                .about__quizio-subtitle {
                    display: block;
                    text-align: center;
                    font-size: 1.3em;
                    color: hsl(60,100%,70%);
                }
                footer {
                    background-color: hsl(252,48%,30%);
                    padding: 25px;
                    color: hsl(0, 0%, 70%);
                    text-align: center;
                    display: grid;
                    grid-gap: 5px;
                    grid-template-columns: 1fr 3fr 1fr;
                }
                .footer__links { 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    margin: -5px;
                }
                .footer__links * {
                    margin: 5px;
                    color: inherit;
                    text-decoration: inherit;
                }
                .go-down {
                    display: none;
                    position: fixed;
                    bottom: -4px;
                    left: 50%;
                    padding: 2px;
                    transform: translateX(-50%);
                    opacity: 0;
                    animation: GoDownArrowAnimation 1.8s ease-out;
                    animation-delay: 1s;
                    animation-iteration-count: infinite;
                }
                @keyframes GoDownArrowAnimation {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-7px);
                    }
                    75% {
                        opacity: 0.8;
                        transform: translateX(-50%) translateY(0px);
                    }
                    100% {
                        opacity: 0;
                    }
                }
                .down-arrow {
                    width: 15px;
                }
                @media (min-height: 667px) {
                    .go-down {
                        display: block;
                    }
                }
                @media (min-height: 675px) {
                    .go-down {
                        bottom: 5px;
                    }
                    .down-arrow {
                        width: 20px;
                    }
                }
                @media (min-height: 700px) {
                    .go-down {
                        bottom: 10px;
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
                        width: 100%;
                        max-width: 300px;
                        box-shadow: 2px 2px 13px grey;
                        border-radius: 5px;
                        padding: 30px;
                        padding-top: 20px;
                        padding-bottom: 100px;
                    }
                    @media (min-width: 750px) {
                        .shell {
                            transform: scale(1.02);
                            max-width: 400px;
                        }
                    }
                    @media (min-width: 1400px) {
                        .shell {
                            transform: scale(1.1);
                            max-width: 400px;
                        }
                    }
                    @media (min-width: 1600px) {
                        .shell {
                            transform: scale(1.2);
                            padding-left: 50px;
                        }
                    }
                    @media (min-width: 1800px) {
                        .shell {
                            transform: scale(1.3);
                            padding-left: 60px;
                        }
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