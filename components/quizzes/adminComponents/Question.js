import { useState, useRef, useCallback } from 'react';

const Question = ({
    questionTitle, questionOptions, onAddNewOption, onSetNewCorrectAnswer,
    onDeleteQuestionOption, onDeleteQuestion, questionOptionTitleKey = "title", miniMode = false }) => {
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
                <div className="question-options-container">
                    <div className="question-options">
                        {questionOptions.map((questionOption, index) => {
                            return (
                                <div className="question-option" key={questionOption.id}>
                                    <span className="order-index">{index + 1}.</span>
                                    <span key={questionOption.id}>
                                        {questionOption[questionOptionTitleKey]}
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
                    </div>
                    <div className="question-options-dimmer"/>
                </div>
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
                <img title="Delete question" src="/static/delete-24px.svg" className="icon-button delete-icon initially-less-visible" onClick={onDeleteQuestion} />
                <img title="New answer option" src="/static/add-icon.svg" className="icon-button add-icon initially-less-visible" onClick={onAddNewOptionButtonClick} />
                <img title="New right answer" className="icon-button new-right-answer-icon initially-less-visible visible-only-mobile" src="/static/check_circle_black.svg" onClick={onAreAllSetAsRightAnswerOptionsVisibleTogglePress} />
                <img title="Delete answer option" className="icon-button delete-answer-icon initially-less-visible visible-only-mobile" src="/static/minus.svg" onClick={onAreAllDeleteOptionsVisibleTogglePress} />
            </article>
            <style jsx>
                {`
                    h2 {
                        margin: 0;
                        padding: 0;
                        font-weight: 400;
                        margin-bottom: 15px;
                        ${miniMode ?
                        `
                            font-size: 1rem;
                            margin-bottom: 0px;
                            text-align: center;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            width: 100%;
                        `
                        :
                        null
                    }
                    }
                    p {
                        margin: 0;
                        padding: 0;
                    }
                    .question-options-container {
                        height: 130px;
                        position: relative;
                        margin-bottom: 13px;
                        overflow: hidden;
                        ${miniMode ?
                        `
                            display: none;
                        `
                        :
                        ''
                        }
                    }
                    .question-options {
                        height: 100%;
                        overflow-y: auto;
                    }
                    .question-options-dimmer {
                        pointer-events: none;
                        content: '';
                        display: block;
                        position: absolute;
                        left: 0px;
                        bottom: 0px;
                        width: 100%;
                        height: 20px;
                        background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
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
                        width: 250px;   
                        height: 250px;
                        background-color: white;
                        border-radius: 8px;
                        padding: 25px;
                        display: flex;
                        flex-direction: column;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
                        margin: 10px;
                        overflow: hidden;
                        ${miniMode ?
                        `
                            width: 80px;
                            height: 80px;
                            padding: 5px;
                            justify-content: center;
                            align-items: center;
                        `
                        :
                        null
                    }
                    }
                    @media (min-width: 450px) {
                        article {
                            width: 275px;
                            height: 300px;
                        }
                        .question-options-container {
                            height: 175px;
                        }
                    }
                    @media (min-width: 1100px) {
                        article {
                            width: 300px;
                            height: 325px;
                        }
                        .question-options-container {
                            height: 195px;
                        }
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
                    .icon-button {
                        ${miniMode ?
                        `
                            display: none;
                        `
                        :
                        null
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
                        right: 80px;
                        bottom: 10px;
                        padding: 5px;
                    }
                    .delete-answer-icon {
                        position: absolute;
                        right: 45px;
                        bottom: 11px;
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