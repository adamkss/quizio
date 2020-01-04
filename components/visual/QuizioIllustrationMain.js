import { SillyHandwritingWithOption } from './SillyHandwriting';

export const QuizioIllustrationMain = ({ stepDelayMs = 0, animationDurationMs = 400 }) => {
    return (
        <>
            <div className="shell">
                <div className="step">
                    <div className="step__content step-1-layout">
                        <img className="woman-drawing" src="/static/illustrations/drawing-woman-colour.svg" />
                        <div className="quiz-card">
                            <SillyHandwritingWithOption text="I like dogs" noMargins />
                            <SillyHandwritingWithOption text="I adore dogs" checked noMargins />
                        </div>
                    </div>
                    <span className="step-1__title step__title">1. Create a quiz</span>
                </div>
                <div className="step">
                    <div className="step__content step-2-layout">
                        <img className="step-2__girl" src="/static/illustrations/woman-dev.svg" />
                        <img className="step-2__guy" src="/static/illustrations/guy-mobile.svg" />
                    </div>
                    <span className="step-2__title step__title">
                        2. Send it to friends, colleagues, random people...
                    </span>
                </div>
                <div className="step">
                    <div className="step__content step-3-layout">
                        <img className="step-3-charts" src="/static/illustrations/guy-charts.svg" />
                    </div>
                    <span className="step-3__title step__title">
                        3. Collect and analyze results. Have fun!
                    </span>
                </div>
            </div>
            <style jsx>
                {`
                    .shell {
                        padding: 30px 0px;
                        display: flex;
                        justify-content: space-around;
                        flex-wrap: wrap;
                        margin-top: -20px;
                    }
                    .step {
                        width: 400px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 0px 10px;
                    }
                    .step__title {
                        margin-top: 5px;
                        font-size: 1.7em;
                        font-weight: 400;
                        text-align: center;
                    }
                    .step__content {
                        flex-grow: 1;
                        width: 100%;
                    }
                    .step-1-layout {
                        position: relative;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    }
                    .quiz-card {
                        width: 200px;
                        height: 160px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 8px hsl(0, 0%, 85%);
                        background-color: white;
                        padding: 15px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        margin-left: -130px;
                        margin-bottom: -100px;
                        position: absolute;
                        top: calc(50% - 180px);
                        left: calc(50% + 110px);
                        transform: rotate(10deg) scale(0.75);
                        animation: QuizCardIn ${`${animationDurationMs}ms;`}
                    }
                    @keyframes QuizCardIn { 
                        0%, 50% {
                            opacity: 0;
                            transform: rotate(5deg) scale(0.5);
                        }
                        
                        100% {
                            opacity: 1;
                            transform: rotate(10deg) scale(0.75);
                        }
                    }
                    .woman-drawing {
                        width: 100%;
                        max-width: 600px;
                        padding-top: 30px;
                        z-index: 2;
                        animation: WomanIn ${`${animationDurationMs}ms;`}
                    }
                    @keyframes WomanIn {
                        0% {
                            opacity: 0;
                            transform: scale(0.7);
                        }
                        100% {
                             opacity : 1;
                            transform: scale(1);
                         }
                    }
                    .step-1__title {
                        animation: FadeIn ${`${animationDurationMs * 2}ms;`}
                    }
                    @keyframes FadeIn {
                        0%, 50% {
                            opacity: 0;
                        }
                        100% {
                            opacity: 1;
                        }
                    }
                    .step-2-layout {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .step-2__guy {
                        width: 100%;
                        max-width: 330px;
                        animation: Step2ManIn ${`${animationDurationMs * 2 + stepDelayMs}ms;`};
                    }
                    @keyframes Step2ManIn{
                        0%, 50% {
                            opacity: 0;
                            transform: translateX(-20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateX(0px);
                        }
                    }
                    .step-2__girl {
                        width: 100%;
                        max-width: 400px;
                        margin-bottom: -50px;
                        padding-top: -80px;
                        animation: Step2WomanIn ${`${animationDurationMs * 2 + stepDelayMs}ms;`}
                    }
                    @keyframes Step2WomanIn{
                        0%, 50% {
                            opacity: 0;
                            transform: translateX(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateX(0px);
                        }
                    }
                    .step-2__title {
                        animation: FadeIn ${`${animationDurationMs * 2 + stepDelayMs}ms;`}
                    }
                    .step-3-charts {
                        width: 100%;
                        max-width: 500px;
                        animation: Step3ChartsIn ${`${animationDurationMs * 3 + stepDelayMs}ms`};
                        transform: scale(1.2);
                    }
                    .step-3__title {
                        animation: FadeIn ${`${animationDurationMs * 3 + stepDelayMs}ms;`}
                    }
                    .step-3-layout {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    @keyframes Step3ChartsIn{
                        0%, 50% {
                            opacity: 0;
                            transform: translateY(20px);
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