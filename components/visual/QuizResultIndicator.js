const QuizResultIndicator = ({result}) => {
    return (
        <>
            <div className="coordinator">
                <div className="first-column"></div>
                <div className="second-column"></div>
                <div className="third-column"></div>
            </div>
            <style jsx>
                {`
                    .coordinator {
                        display: flex;
                        align-items: flex-end;
                        padding: 0px 15px;
                    }
                    .coordinator > div {
                        --low: red;
                        --medium: orange;
                        --high: green;
                        width: 7px;
                    }.coordinator > div:not(:last-child) {
                        margin-right: 2px;
                    }
                    .first-column {
                        height: 40%;
                        border: 1px solid grey;
                        ${result === "low" ?
                        `
                        border: 1px solid transparent;
                        background-color: var(--low);
                        `
                        :
                        ``
                    } 
                    ${result === "medium" ?
                        `
                        border: 1px solid transparent;
                        background-color: var(--medium);
                        `
                        :
                        ``
                    }
                    ${result === "high" ?
                        `
                        border: 1px solid transparent;
                        background-color: var(--high);
                        `
                        :
                        ``
                    }
                    
                    }
                    .second-column {
                        height: 65%;
                        border: 1px solid grey;
                        ${result === "medium" ?
                        `
                        border: 1px solid transparent;
                        background-color: var(--medium);
                        `
                        :
                        ``
                    } 
                    ${result === "high" ?
                        `
                        border: 1px solid transparent;
                        background-color: var(--high);
                        `
                        :
                        ``
                    }
                    }
                    .third-column {
                        height: 100%;
                        border: 1px solid grey;
                        ${result === "high" ?
                        `
                        border: 1px solid transparent;
                        background-color: var(--high);
                        `
                        :
                        ``
                    }
                    }
                `}
            </style>
        </>
    )
}

export default QuizResultIndicator;

export const ResultTypes = ["low", "medium", "high"];
export const getQuizResultIndicator = percentage => {
    if (percentage >= 0 && percentage < 34)
        return <QuizResultIndicator result="low" />
    if (percentage >= 34 && percentage < 80)
        return <QuizResultIndicator result="medium" />
    if (percentage >= 80)
        return <QuizResultIndicator result="high" />
}
