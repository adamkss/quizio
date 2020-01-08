import LayoutSetup from "../components/layoutSetup";
import TextInput from "../components/TextInput";
import React from 'react';
import PrimaryButton from "../components/PrimaryButton";
import { createNewGenericQuiz } from "../utils/QuizRequests";
import Router from 'next/router';

export default ({ }) => {
    const [title, setTitle] = React.useState("");
    const [isForwardButtonVisible, setIsForwardButtonVisible] = React.useState(false);
    const [wasEnteringEffectShown, setWasEnteringEffectShown] = React.useState(false);

    React.useEffect(() => {
        setWasEnteringEffectShown(true);
    }, []);

    React.useEffect(() => {
        if (title !== "") {
            setIsForwardButtonVisible(true);
        } else {
            setIsForwardButtonVisible(false);
        }
    }, [title]);

    const onCreatePress = React.useCallback(async () => {
        const { id: newQuizId } = await createNewGenericQuiz(title);
        Router.push(`/genericQuizzes/${newQuizId}/editor`);
    }, [title]);

    return (
        <>
            <LayoutSetup />
            <header>
                <h1>Quizio</h1>
            </header>
            <main className={`${wasEnteringEffectShown ? null : "fade-in"}`}>
                <section className="dialog">
                    <h1>Name your quiz</h1>
                    <div className="horizontally-centered">
                        <TextInput width="100%" marginTop="20px" placeholder="Ex. Super hard math quiz..." value={title} valueSetter={setTitle} />
                    </div>
                    <div className="buttons-section">
                        <PrimaryButton medium rightAligned title="Let's begin!" onClick={isForwardButtonVisible ? onCreatePress : null} />
                    </div>
                </section>
            </main>
            <style jsx>
                {`
                    h1 {
                        font-size: 2.5em;
                    }
                    main {
                        width: 100%;
                        height: 100vh;
                        position: relative;
                        display: flex;
                        justify-content: center;
                        padding: 30px;
                    }
                    header h1 {
                        font-size: 2em;
                        position: fixed;
                        top: 3px;
                        left: 50%;
                        transform: translateX(-50%);
                        opacity: 0.8;
                    }
                    .dialog {
                        position: relative;
                        width: 100%;
                        max-width: 700px;
                        min-width: 300px;
                        margin-top: 20vh;
                        ${isForwardButtonVisible ?
                        "height: 295px"
                        :
                        "height: 240px"
                    };
                        padding: 30px;
                        box-shadow: 0px 2px 8px #00000040;
                        border-radius: 7px;
                        transition: all 0.3s;
                    }
                    @media (min-width: 375px) {
                        .dialog {
                            ${isForwardButtonVisible ?
                        "height: 240px"
                        :
                        "height: 200px"
                    };
                        }
                    }
                    .buttons-section {
                        position: absolute;
                        left: 30px;
                        right: 30px;
                        bottom: 30px;
                        opacity: ${isForwardButtonVisible ? "1" : "0"};
                        visibility: ${isForwardButtonVisible ? "visible" : "hidden"};
                        transition: all 0.2s;
                    }
                    .fade-in { 
                    }
                    @keyframes SlideAndFadeIn {
                        0% {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0px);
                        }
                    }
            `}
            </style>
        </>
    )
}