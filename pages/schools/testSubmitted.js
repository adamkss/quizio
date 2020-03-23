import LayoutSetup from "../../components/layoutSetup"
import { useEffect, useState } from "react";

const getColorByResultPercentage = percentage => {
    if (percentage < 25)
        return "#e53935";
    if (percentage < 50)
        return "#ff6f00";
    if (percentage < 75)
        return "#03a9f4";
    if (percentage <= 100)
        return "#388e3c";
}

export default ({ }) => {
    const circleRadius = 43;
    //Perimeter of a circle is 2*Pi*r. Used for the DashArray animation.
    const circlePerimeter = circleRadius * 3.1415 * 2;
    const [resultPercentage, setResultPercentage] = useState(null);
    const [resultColor, setResultColor] = useState(null);

    useEffect(() => {
        const resultPercentage = Math.round(localStorage.getItem('resultPercentage'));
        setResultPercentage(resultPercentage);
    }, []);

    useEffect(() => {
        setResultColor(getColorByResultPercentage(resultPercentage));
    }, [resultPercentage]);

    return (
        <>
            <LayoutSetup title="Test submitted" />
            <main>
                <div className="card fade-and-slide-in">
                    <h1>Quizio Schools</h1>
                    <span className="message">You submitted the test successfully!</span>
                    {resultPercentage ?
                        <div className="result-indicator fade-in">
                            <svg height="100" width="100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={circleRadius}
                                    stroke-width="11"
                                    fill="transparent" />
                            </svg>
                            <span className="result-text">{resultPercentage}%</span>
                        </div>
                        :
                        null
                    }
                </div>
            </main>
            <style jsx>
                {`
                main {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .card {
                    width: 90%;
                    max-width: 400px;
                    height: 500px;
                    max-height: 90vh;
                    box-shadow: 0px 0px 8px rgba(0,0,0,0.4);
                    border-radius: 10px;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .message {
                    font-weight: 300;
                    margin-bottom: 35px;
                }
                circle {
                    stroke: ${resultColor};
                    stroke-dasharray: ${circlePerimeter};
                    stroke-dashoffset: ${circlePerimeter};
                    animation: Circley ${2 * resultPercentage / 100}s ease-out forwards;
                    animation-delay: 1s;
                    transform-origin: center center;
                    transform: rotate(-90deg) scale(1, -1);
                }
               .result-indicator {
                   position: relative
               }
               .result-text {
                   display: block;
                   position: absolute;
                   top: 50%;
                   left: 50%;
                   transform: translate(-47%, -60%);
                   text-align: center;
                   vertical-align: middle;
                   font-size: 1.4rem;
               }
               
                @keyframes Circley {
                    0% {
                        opacity: 0;
                    }
                    75% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: ${circlePerimeter - circlePerimeter * resultPercentage / 100};
                    }
                }
                svg {
                    
                }
                .result-text {
                }
            `}
            </style>
        </>
    )
}