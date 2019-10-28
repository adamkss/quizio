import { useState, useRef, useCallback } from 'react';

const Question = ({ questionTitle, questionOptions, onAddNewOption, onSetNewCorrectAnswer, onDeleteQuestionOption, onDeleteQuestion }) => {
    const [isNewOptionWanted, setIsNewOptionWanted] = useState(false);
    const [newOption, setNewOption] = useState("");
    const newOptionInputRef = useRef(null);
    const [areSetRightAnswerVisible, setAreSetRightAnswerVisible] = useState(false);
    const [areDeleteOptionVisible, setAreDeleteOptionVisible] = useState(false);

    const onAddNewOptionButtonClick = useCallback((event) => {
        setIsNewOptionWanted(true);
        event.stopPropagation();
    }, []);

    const onNewOptionValueChange = useCallback((event) => {
        setNewOption(event.target.value);
    }, []);

    const onCancelNewOptionCreation = useCallback((e) => {
        if (e.target.tagName === "ARTICLE" || e.target.tagName === "P" || e.target.tagName === "BUTTON") {
            setIsNewOptionWanted(false);
            setNewOption("");
        }
    }, []);

    const onSaveNewOption = useCallback(() => {
        onAddNewOption(newOption);
        setIsNewOptionWanted(false);
        setNewOption("");
    }, [newOption]);

    const onCancelAddNewOption = useCallback(() => {
        setIsNewOptionWanted(false);
        setNewOption("");
    }, []);

    const onKeyDownNewOptionInput = useCallback((event) => {
        //Exit is pressed
        if (event.keyCode === 27) {
            onCancelAddNewOption();
        }
        //Enter was pressed
        if (event.keyCode === 13) {
            onSaveNewOption();
        }
    }, [onSaveNewOption, onCancelAddNewOption]);

    const getSetNewCorrectQuestionOptionCallback = (newCorrectOptionId) => async () => {
        onSetNewCorrectAnswer(newCorrectOptionId);
    };

    const getDeleteQuestionOptionCallback = (questionOptionIdToDelete) => () => {
        onDeleteQuestionOption(questionOptionIdToDelete);
    }

    const onAreAllSetAsRightAnswerOptionsVisibleTogglePress = useCallback(() => {
        setAreSetRightAnswerVisible((value) => !value);
    }, []);

    const onAreAllDeleteOptionsVisibleTogglePress = useCallback(() => {
        setAreDeleteOptionVisible((value) => !value);
    }, []);

    return (
        <>
            <article onClick={onCancelNewOptionCreation}>
                <h2>{questionTitle}</h2>
                {questionOptions.map((questionOption, index) => {
                    return (
                        <div className="question-option" key={questionOption.id}>
                            <span className="order-index">{index + 1}.</span>
                            <span key={questionOption.id}>
                                {questionOption.title}
                            </span>
                            {questionOption.amITheRightAnswer ?
                                <img className="right-answer-icon initially-less-visible" src="/static/check_circle-24px.svg" title="This is the right answer." />
                                :
                                null
                            }
                            {!questionOption.amITheRightAnswer ?
                                <img title="Set as right answer"
                                    className={`accent-on-question-hover not-visible-implicitly-no-hover${areSetRightAnswerVisible ? " visible" : ""}`}
                                    src="/static/check_circle_black.svg"
                                    onClick={getSetNewCorrectQuestionOptionCallback(questionOption.id)} />
                                :
                                null
                            }
                            <img title="Delete answer"
                                className={`accent-on-question-hover not-visible-implicitly-no-hover${areDeleteOptionVisible ? " visible" : ""}`}
                                src="/static/delete-24px.svg"
                                onClick={getDeleteQuestionOptionCallback(questionOption.id)} />
                        </div>
                    )
                })}
                {isNewOptionWanted ?
                    <div className="add-new-option-section">
                        <input autoFocus ref={newOptionInputRef} type="text" value={newOption}
                            onChange={onNewOptionValueChange}
                            onKeyDown={onKeyDownNewOptionInput} />
                        <img title="Cancel" src="/static/delete-24px.svg" className="new-option-operation cancel-new-option" onClick={onCancelAddNewOption} />
                        <img title="Save question option" src="/static/check_circle_black.svg" className="new-option-operation save-new-option" onClick={onSaveNewOption} />
                    </div>
                    :
                    null
                }
                <img title="Delete question" src="/static/delete-24px.svg" className="delete-icon initially-less-visible" onClick={onDeleteQuestion} />
                <img title="New answer option" src="/static/add-icon.svg" className="add-icon initially-less-visible" onClick={onAddNewOptionButtonClick} />
                <img title="New right answer" className="new-right-answer-icon initially-less-visible visible-only-mobile" src="/static/check_circle_black.svg" onClick={onAreAllSetAsRightAnswerOptionsVisibleTogglePress} />
                <img title="Delete answer option" className="delete-answer-icon initially-less-visible visible-only-mobile" src="/static/delete-24px.svg" onClick={onAreAllDeleteOptionsVisibleTogglePress} />
            </article>
            <style jsx>
                {`
                    h2 {
                        margin: 0;
                        padding: 0;
                        font-weight: 400;
                        margin-bottom: 15px;
                    }
                    p {
                        margin: 0;
                        padding: 0;
                    }
                    .question-option {
                        font-family: Arial;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        height: 25px;
                    }
                    .question-option:not(:last-child) {
                        margin-bottom: 15px;
                    }
                    .question-option .order-index {
                        margin-right: 5px;
                    }
                    .accent-on-question-hover {
                        margin-left: 5px;
                        opacity: 0.6;
                    }
                    .not-visible-implicitly-no-hover {
                        display: none;
                    }
                    
                    @media (hover:hover) {
                        .visible-only-mobile {
                            display: none;
                        }
                        .accent-on-question-hover {
                            cursor: pointer;
                            opacity: 0;
                            transition: all 0.3s;
                        }
                        .question-option:hover .accent-on-question-hover:not(:hover) {
                            opacity: 0.6;
                        }
                        .accent-on-question-hover:hover {
                            opacity: 1;
                        }
                        .initially-less-visible {
                        opacity: 0.4;
                        transition: all 0.3s;
                        }
                        article:hover .initially-less-visible {
                            opacity: 1;
                        }
                        .not-visible-implicitly-no-hover {
                            display: block;
                        }
                    }

                    .visible {
                        display: block;
                    }
                    article {
                        position: relative;
                        width: calc(100% - 20px);
                        max-width: 400px;
                        min-width: 330px;
                        border-radius: 8px;
                        padding: 25px;
                        display: flex;
                        flex-direction: column;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
                        margin: 10px;
                        animation: SlideUp 0.3s;
                    }
                    @keyframes SlideUp {
                        0% {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0px);
                            opacity: 1;
                        }
                    }
                    .delete-icon {
                        position: absolute;
                        right: 10px;
                        top: 10px;
                        cursor: pointer;
                        padding: 5px;
                    }
                    .add-icon {
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        cursor: pointer;
                        padding: 5px;
                    }
                    .new-right-answer-icon {
                        position: absolute;
                        right: 45px;
                        bottom: 10px;
                        padding: 5px;
                    }
                    .delete-answer-icon {
                        position: absolute;
                        right: 80px;
                        bottom: 10px;
                        padding: 5px;
                    }
                    .right-answer-icon {
                        margin-left: 5px;
                    }
                    .add-new-option-section {
                        display: flex;
                        padding-bottom: 35px;
                    }
                    .add-new-option-section input {
                        flex-grow: 1;
                        font-family: 'Arial', sans-serif;
                        font-size: 1.1em;
                        outline: none;
                        border: none;
                        border-bottom: 1px solid grey;
                        display: flex;
                    }

                    .new-option-operation {
                        padding: 0px 3px;
                    }
                `}
            </style>
        </>
    )
}

export default Question;