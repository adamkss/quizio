import LayoutSetup from './layoutSetup';

export const ProgressIndicator = ({ numberOfSteps = 3, currentStep = 2, paddingPx = 20 }) => {
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
                    padding: ${paddingPx}px;
                    pointer-events: none;
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