import LayoutSetup from "../components/layoutSetup";
import TextInput from "../components/TextInput";
import React from 'react';
import PrimaryButton from "../components/PrimaryButton";
import { createNewGenericQuiz } from "../utils/QuizRequests";
import Router from 'next/router';

export default ({ }) => {
    const [title, setTitle] = React.useState("");
    const [isForwardButtonVisible, setIsForwardButtonVisible] = React.useState(false);

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
            <main>
                <section className="dialog">
                    <h1>Name your quiz</h1>
                    <div className="horizontally-centered">
                        <TextInput width="100%" marginTop="20px" placeholder="Ex. Super hard math quiz..." value={title} valueSetter={setTitle} />
                    </div>
                    <div className="buttons-section">
                        <PrimaryButton rightAligned title="Let's begin!" onClick={onCreatePress} />
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
                    .dialog {
                        position: relative;
                        width: 100%;
                        max-width: 700px;
                        min-width: 340px;
                        margin-top: 25vh;
                        ${isForwardButtonVisible ?
                        "height: 240px"
                        :
                        "height: 200px"
                    };
                        padding: 30px;
                        box-shadow: 0px 2px 8px #00000040;
                        border-radius: 7px;
                        transition: all 0.3s;
                    }
                    .buttons-section {
                        position: absolute;
                        left: 30px;
                        right: 30px;
                        bottom: 30px;
                        opacity: ${isForwardButtonVisible ? "1" : "0"};
                        transition: all 0.2s;
                    }
            `}
            </style>
        </>
    )
}