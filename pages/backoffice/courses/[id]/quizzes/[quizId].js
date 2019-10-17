import { useRouter } from 'next/router'
import { getAllQuestionsOfAQuiz, saveQuestion, addOptionToQuestion, setNewAnswerOptionAsCorrectAnswer, deleteQuestionOptionFromQuestion, deleteQuestion } from '../../../../../utils/QuizRequests';
import GenericDialog from '../../../../../components/GenericDailog';
import { useState, useCallback, useEffect, useRef } from 'react';
import { BackOfficeLayoutWrapper } from '../../../../../components/BackOfficeLayoutWrapper';
import TextInput from '../../../../../components/TextInput';
import PrimaryButton from '../../../../../components/PrimaryButton';

const getNewQuestionsWithUpdatedQuestionOptions = (questions, questionId, newQuestionOptions) => {
    const questionOptionUpdated = questions.find(question => question.id == questionId);
    const questionToAlterIndex = questions.indexOf(questionOptionUpdated);

    if (questionOptionUpdated) {
        return [
            ...questions.slice(0, questionToAlterIndex),
            {
                ...questionOptionUpdated,
                questionOptions: newQuestionOptions
            },
            ...questions.slice(questionToAlterIndex + 1, questions.length)
        ]
    }
    return questions;
}

export default () => {
    const { quizId } = useRouter().query;
    const [questions, setQuestions] = React.useState([]);
    const [isCreatingQuestionNow, setIsCreatingQuestionNow] = React.useState(false);

    const getAndSetAllQuestionsOfAQuiz = useCallback(async (quizId) => {
        if (quizId) {
            const questions = await getAllQuestionsOfAQuiz(quizId);
            setQuestions(questions);
        }
    }, [quizId]);

    React.useEffect(() => {
        getAndSetAllQuestionsOfAQuiz(quizId);
    }, [quizId]);

    const createQuestionCallback = React.useCallback(() => {
        setIsCreatingQuestionNow(true);
    }, [quizId]);

    const onDismissCreateQuestionDialog = React.useCallback(() => {
        setIsCreatingQuestionNow(false);
    }, []);

    const onSaveQuestion = (title, questionOptions, rightAnswer) => {
        saveQuestion(quizId, title, questionOptions, rightAnswer).then(() => {
            setIsCreatingQuestionNow(false);
            getAndSetAllQuestionsOfAQuiz(quizId);
        });
    }

    const getOnAddNewOptionCallback = (questionId) => async (newQuestionOption) => {
        const newQuestionOptions = await addOptionToQuestion(questionId, newQuestionOption);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    };

    const getOnSetNewCorrectAnswerCallback = (questionId) => async (questionOptionId) => {
        const newQuestionOptions = await setNewAnswerOptionAsCorrectAnswer(questionId, questionOptionId);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    };

    const getOnDeleteQuestionOptionFromQuestion = (questionId) => async (questionOptionId) => {
        const newQuestionOptions = await deleteQuestionOptionFromQuestion(questionId, questionOptionId);
        setQuestions(getNewQuestionsWithUpdatedQuestionOptions(
            questions,
            questionId,
            newQuestionOptions
        ))
    }

    const getOnDeleteQuestionCallback = (questionId) => async () => {
        const { status } = await deleteQuestion(questionId);
        if (status >= 200 && status <= 300) {
            const question = questions.find(question => question.id === questionId);
            if (question) {
                const indexOfQuestionToDelete = questions.indexOf(question);
                setQuestions(
                    [
                        ...questions.slice(0, indexOfQuestionToDelete),
                        ...questions.slice(indexOfQuestionToDelete + 1, questions.length)
                    ]
                )
            }
        }
    }

    return (
        <BackOfficeLayoutWrapper>
            <>
                <main>
                    {questions.map(question =>
                        <Question
                            questionTitle={question.question}
                            questionOptions={question.questionOptions}
                            key={question.id}
                            onAddNewOption={getOnAddNewOptionCallback(question.id)}
                            onSetNewCorrectAnswer={getOnSetNewCorrectAnswerCallback(question.id)}
                            onDeleteQuestionOption={getOnDeleteQuestionOptionFromQuestion(question.id)}
                            onDeleteQuestion={getOnDeleteQuestionCallback(question.id)}
                        />
                    )}
                    <img
                        title="Create new question"
                        className="add-question-fab"
                        src="/static/create_fab.svg"
                        onClick={createQuestionCallback} />
                    {isCreatingQuestionNow ?
                        <CreateQuestionDialog
                            onDismissDialog={onDismissCreateQuestionDialog}
                            onSaveQuestion={onSaveQuestion} />
                        :
                        null}
                </main>
                <style jsx>
                    {`
                main {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    padding: 20px;
                    margin: -10px;
                    position: relative;
                }
                .add-question-fab {
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    cursor: pointer;
                    border-radius: 50%;
                }
                `}
                </style>
            </>
        </BackOfficeLayoutWrapper>
    )
}

const Question = ({ questionTitle, questionOptions, onAddNewOption, onSetNewCorrectAnswer, onDeleteQuestionOption, onDeleteQuestion }) => {
    const [isNewOptionWanted, setIsNewOptionWanted] = useState(false);
    const [newOption, setNewOption] = useState("");
    const newOptionInputRef = useRef(null);

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

    const onKeyDownNewOptionInput = useCallback((event) => {
        //Exit is pressed
        if (event.keyCode === 27) {
            setIsNewOptionWanted(false);
            setNewOption("");
        }
        //Enter was pressed
        if (event.keyCode === 13) {
            onAddNewOption(newOption);
            setIsNewOptionWanted(false);
            setNewOption("");
        }
    }, [newOption]);

    const getSetNewCorrectQuestionOptionCallback = (newCorrectOptionId) => async () => {
        onSetNewCorrectAnswer(newCorrectOptionId);
    };

    const getDeleteQuestionOptionCallback = (questionOptionIdToDelete) => () => {
        onDeleteQuestionOption(questionOptionIdToDelete);
    }

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
                                    className="accent-on-question-hover"
                                    src="/static/check_circle_black.svg"
                                    onClick={getSetNewCorrectQuestionOptionCallback(questionOption.id)} />
                                :
                                null
                            }
                            <img title="Delete answer"
                                className="accent-on-question-hover"
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
                    </div>
                    :
                    null
                }
                <img title="Delete question" src="/static/delete-24px.svg" className="delete-icon initially-less-visible" onClick={onDeleteQuestion} />
                <img title="New answer option" src="/static/add-icon.svg" className="add-icon initially-less-visible" onClick={onAddNewOptionButtonClick} />
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
                        cursor: pointer;
                        opacity: 0;
                        transition: all 0.3s;
                        margin-left: 5px;
                    }
                    .question-option:hover .accent-on-question-hover:not(:hover) {
                        opacity: 0.6;
                    }
                    .accent-on-question-hover:hover {
                        opacity: 1;
                    }
                    article {
                        position: relative;
                        width: 400px;
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
                    .initially-less-visible {
                        opacity: 0.4;
                        transition: all 0.3s;
                    }
                    article:hover .initially-less-visible {
                        opacity: 1;
                    }
                    .right-answer-icon {
                        margin-left: 5px;
                    }
                    .add-new-option-section input {
                        width: 300px;
                        font-family: 'Arial', sans-serif;
                        font-size: 1.1em;
                        outline: none;
                        border: none;
                        border-bottom: 1px solid grey;
                    }
                `}
            </style>
        </>
    )
}

const CreateQuestionDialog = ({ onDismissDialog, onSaveQuestion }) => {
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionOptions, setQuestionOptions] = useState([]);
    const [isNewQuestionReadyToBeCreated, setIsNewQuestionReadyToBeCreated] = useState(false);

    const getCallbackForInputChange = useCallback((setter) => (event) => {
        setter(event.target.value);
    }, []);

    const createNewEmptyOption = useCallback(() => {
        setQuestionOptions(questionOptions => [...questionOptions, ""])
    });

    const getQuestionOptionValueUpdateCallback = useCallback((index) => (event) => {
        const newValue = event.target.value;
        setQuestionOptions(questionOptions => {
            return [
                ...questionOptions.slice(0, index),
                newValue,
                ...questionOptions.slice(index + 1, questionOptions.length)
            ]
        })
    }, []);

    const getQuestionOptionsDeleteCallback = useCallback(index => event => {
        setQuestionOptions(questionOptions => {
            return [
                ...questionOptions.slice(0, index),
                ...questionOptions.slice(index + 1, questionOptions.length)
            ]
        })
    }, []);

    const onSaveQuestionClicked = () => {
        onSaveQuestion(questionTitle, questionOptions, "");
    }

    useEffect(() => {
        setIsNewQuestionReadyToBeCreated(questionTitle != "" && questionOptions.length > 0 && questionOptions.find(questionOption => questionOption == "") != "");
    }, [questionTitle, questionOptions]);

    return (
        <>
            <GenericDialog onDismissDialog={onDismissDialog} title="Create new question" >
                <form>
                    <TextInput
                        title="Question:"
                        value={questionTitle}
                        onChange={getCallbackForInputChange(setQuestionTitle)}
                        name="question-title"
                        type="text"
                        placeholder="Type question here..." />
                    <label>Options:</label>
                    {questionOptions.length === 0 ?
                        <div className="horizontally-centered">
                            <span className="no-options-yet">No options defined yet.</span>
                        </div>
                        :
                        null}
                    {questionOptions.map((questionOption, index) =>
                        <div className="option-input-wrapper" key={index}>
                            <TextInput
                                key={index}
                                type="text"
                                placeholder="Option here..."
                                value={questionOption}
                                onChange={getQuestionOptionValueUpdateCallback(index)} />
                            <img
                                title="Delete option"
                                className="delete-option-icon"
                                src="/static/delete-24px.svg"
                                onClick={getQuestionOptionsDeleteCallback(index)} />
                        </div>
                    )}
                    <div className="horizontally-centered">
                        <button className="add-option" onClick={createNewEmptyOption}>Add option</button>
                    </div>
                    <PrimaryButton
                        title="Save question"
                        inactive={!isNewQuestionReadyToBeCreated}
                        onClick={isNewQuestionReadyToBeCreated ? onSaveQuestionClicked : null}
                        rightAligned />
                </form>
            </GenericDialog>
            <style jsx>
                {`
                  .option-input-wrapper {
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                  }
                  span.no-options-yet {
                      font-weight: 200;
                      font-size: 0.9em;
                      margin-bottom: 15px;
                  }
                  .delete-option-icon {
                      padding: 10px;
                      opacity: 0.7;
                      cursor: pointer;
                      transition: all 0.3s;
                  }
                  .delete-option-icon:hover {
                      opacity: 0.9;
                  }
                  button.add-option {
                      width: 100px;
                      height: 30px;
                      border: 0;
                      outline: none;
                      font-family: 'Oswald', serif;
                      border-radius: 8px;
                      background-color: purple;
                      color: white;
                      box-shadow: 1px 1px 8px purple;
                      cursor: pointer;
                      font-size: .9em;
                      transition: all 0.3s;
                  }
                  button.add-option:hover {
                      box-shadow: 1px 1px 12px purple;
                  }
                `}
            </style>
        </>
    )
}