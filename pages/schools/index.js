import LayoutSetup from "../../components/layoutSetup"
import React, { useRef, useEffect, useState } from 'react';
import SecondaryButton from "../../components/SecondaryButton";
import PrimaryButton from "../../components/PrimaryButton";
import { SillyHandwritingWithOption } from '../../components/visual/SillyHandwriting';
import Link from "next/link";
import Head from "next/head";

export default () => {
    const mainContentRef = useRef(null);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

    useEffect(() => {
        const scrollEventListener = () => {
            const scrollTop = mainContentRef.current.scrollTop;
            if (scrollTop >= 1) {
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
            <Head>
                <title>Quizio - For Schools</title>
            </Head>
            <LayoutSetup />
            <header className={`${isHeaderSticky ? "sticky" : ""}`}>
                <h1>Quizio</h1>
                <nav>
                    <ul>
                        <li><a href="#head">Home</a></li>
                        <li><a href="#quizio-presentation">The flow</a></li>
                        <li><a href="#about-us">About us</a></li>
                        <li><Link href="/"><a>Quizio</a></Link></li>
                        <li><Link href="/login"><a>Login</a></Link></li>
                    </ul>
                </nav>
            </header>
            <main ref={mainContentRef}>
                <section id="head" className="head">
                    <div className="entry-stuff-container">
                        <h1 className="head__name">Quizio</h1>
                        <p className="head__schools"><span className="head__schools__text">Schools</span><img className="head__schools__dev-woman" src="/static/illustrations/dev-woman.svg" /></p>
                        <p className="head__subtitle">Create and distribute tests in minutes</p>
                        <PrimaryButton
                            title="Take test now"
                            big
                            growWithScreenSize
                            color="blue"
                            customMarginTop="25"
                            linkTo="/schools/takeTest"
                        />
                        <p className="main__option-separator-text">...or</p>
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
                </section>
                <section id="quizio-presentation" className="quizio-presentation">
                    <div className="presentation__tile">
                        <p className="presentation-tile__text">Create interactive tests</p>
                        <img className="presentation-tile__image" src="/static/illustrations/quizio_schools/support-notes-colour.svg" />
                    </div>
                    <div className="presentation__tile">
                        <p className="presentation-tile__text">Send them to students</p>
                        <img className="presentation-tile__image send-to-students-image" src="/static/illustrations/quizio_schools/list-app-colour.svg" />
                    </div>
                    <div className="presentation__tile">
                        <p className="presentation-tile__text">Analyze results and view statistics</p>
                        <img className="presentation-tile__image analyze-results-image" src="/static/illustrations/quizio_schools/charts-and-graphs.svg" />
                    </div>
                </section>
                <section id="about-us" className="about-us-container">
                    <h1>About us</h1>
                    <span className="about__quizio-title">Quizio</span>
                    <span className="about__quizio-subtitle">making quizzes beautiful since 2020. <br/> Made by Andra Neagu.</span>
                </section>
                <footer>
                    <span>Quizio - 2020</span>
                    <div className="footer__links">
                        <Link href="/schools#head">
                            <a>Home</a>
                        </Link>
                        <Link href="/schools#quizio-presentation">
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
                    <a className="go-down" href="/schools#quizio-presentation" title="Scroll">
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
                    font-size: 1.5rem;
                    display: none;
                }
                header.sticky h1 {
                    opacity: 1;
                }
                header.sticky {
                    box-shadow: 0px 0px 12px hsl(0, 0%, 70%);
                }
                .head__schools {
                    color: rgba(0,0,0,1);
                    padding: 2px 15px;
                    font-size: 6rem;
                    font-weight: 600;
                    border-radius: 10px;
                    transform: translateY(-20px) rotate(3deg);
                    position: relative;
                    animation: HeadSchoolsTextAnimation 2.5s ease-out;
                }
                @keyframes HeadSchoolsTextAnimation {
                    0% {
                        transform: translateY(-20px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(0deg);
                    }
                    100% {
                        transform: translateY(-20px) rotate(3deg);
                    }
                }
                .head__schools__dev-woman {
                    position: absolute;
                    width: 220px;
                    top: -65px;
                    right: -97px;
                    animation: HeadSchoolsDevWomanAnimation 1.5s ease-out;
                }
                @keyframes HeadSchoolsDevWomanAnimation {
                    0% {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        transform: translateY(0px);
                        opacity: 1;
                    }
                }
                .head__name {
                    margin-top: -50px;
                }
                nav {
                    flex: 1;
                }
                nav ul {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                nav li {
                    padding: 2px;
                    list-style-type: none;
                    font-size: 1em;
                }
                nav a {
                    color: inherit;
                    text-decoration: none;
                }
                @media (min-width: 500px) {
                    header h1 {
                        display: block;
                    }
                    nav {
                        flex: none;
                    }
                    nav ul {
                        justify-content: center;
                    }
                    nav li {
                        margin-right: 7px;
                    }
                }
                @media(min-width: 400px) {
                    nav li {
                        font-size: 1.2em;
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
                .main__option-separator-text {
                    margin-top: 10px;
                    font-size: 1.3rem;
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
                .entry-stuff-container {
                    width: 100%;
                    height: calc(100vh - 50px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 0px;
                    margin-top: 10px;
                    animation: SlideDownAndFadeIn 1s;
                }
                .entry-stuff-container h1 {
                    font-size: 7em;
                    font-weight: 700;
                }
                .head__subtitle  {
                    margin-top: -15px;
                    font-size: 2em;
                    text-align: center;
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
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    padding: -30px;
                }
                .presentation__tile {
                    width: 310px;
                    height: 400px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.3);
                    margin: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 30px;
                    overflow: hidden;
                }
                .presentation-tile__text {
                    font-size: 1.7rem;
                    text-align: center;
                    flex-grow: 1;
                }
                .presentation-tile__image {
                    height: 300px;
                }
                .send-to-students-image {
                    transform: translateY(4px) scale(1.05);
                }
                .analyze-results-image {
                    transform: translateY(-28px) scale(1.5);
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