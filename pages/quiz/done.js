import LayoutSetup from "../../components/layoutSetup";

export default () => {
    return (
        <>
            <LayoutSetup />
            <main>
                <div className="message">
                    <h1>Congratulations!</h1>
                    <h2>You finished the quiz.</h2>
                    <div className="buttons-container">
                        <button className="take-another-quiz-button">Take another quiz</button>
                        <button className="continue-learning-button">Continue learning</button>
                    </div>
                </div>
            </main>
            <style jsx>
                {`
                main {
                    display: flex;
                    justify-content:center;
                    align-items: center;
                    width: 100%;
                    height: 100vh;
                    background: linear-gradient(100deg, #53d3d1 0%, #fbeceb 95%);
                }
                .message {
                    width: 650px;
                    padding: 50px;
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
                    border-radius: 8px;
                    background-color: white;
                    animation: AppearNicely 1s ease-in-out;
                    box-sizing: border-box;
                }
                h1 {
                    font-size: 2.5em;
                    font-weight: 700;
                    color: #002447;
                }
                h2 {
                    font-weight: 400;
                    color: #393b63;
                    padding-top: 0px;
                    margin-top: 0px;
                }
                .buttons-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    padding-top: 100px;
                    padding-bottom: 60px;
                }
                .buttons-container button {
                    padding: 10px;
                    border-radius: 10px;
                    outline: none;
                    border: none;
                    color: white;
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.15em;
                }
                .take-another-quiz-button {
                    background-color: purple;
                    box-shadow: 0px 0px 7px purple;
                }
                .continue-learning-button {
                    background-color: green;
                    box-shadow: 0px 0px 7px green;
                }

                .message * {
                    animation: FadeIn 1.5s ease-in;
                }
                @keyframes AppearNicely {
                    0% {
                        opacity: 0;
                        transform: scaleY(0.3);
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 1;
                        transform: scaleY(1);
                    }
                }
                @keyframes FadeIn {
                    0% {
                        opacity: 0;
                    }
                    30% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                `}
            </style>
        </>
    )
}