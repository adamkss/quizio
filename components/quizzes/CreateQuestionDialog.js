import { useCallback, useState, useEffect } from 'react';
import GenericDialog from '../GenericDailog';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import { OnEnterPressBoundary } from '../../components/OnEnterPressBoundary';

export default ({ onDismissDialog, onSaveQuestion }) => {
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionOptions, setQuestionOptions] = useState([""]);
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
            <OnEnterPressBoundary onEnterPressed={isNewQuestionReadyToBeCreated ? onSaveQuestionClicked : null}>
                <GenericDialog onDismissDialog={onDismissDialog} title="Create new question" >
                    <TextInput
                        title="Question:"
                        value={questionTitle}
                        onChange={getCallbackForInputChange(setQuestionTitle)}
                        name="question-title"
                        type="text"
                        placeholder="Type question here..."
                        width="100%"
                        autoFocus />
                    <label className="options-label">Options:</label>
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
                                autoFocus={questionOptions.length > 1}
                                onChange={getQuestionOptionValueUpdateCallback(index)}
                                width="100%" />
                            <img
                                title="Delete option"
                                className="delete-option-icon"
                                src="/static/delete-24px.svg"
                                onClick={getQuestionOptionsDeleteCallback(index)} />
                        </div>
                    )}
                    <div className="horizontally-centered">
                        <PrimaryButton title="Add option" color="pink" medium onClick={createNewEmptyOption}/>
                    </div>
                    <PrimaryButton
                        title="Save question"
                        medium
                        marginTop
                        inactive={!isNewQuestionReadyToBeCreated}
                        onClick={isNewQuestionReadyToBeCreated ? onSaveQuestionClicked : null}
                        rightAligned />
                </GenericDialog>
            </OnEnterPressBoundary>

            <style jsx>
                {`
                  .option-input-wrapper {
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                  }
                  .options-label {
                      font-size: 1.2rem;
                  }
                  span.no-options-yet {
                      font-weight: 200;
                      font-size: 1.1rem;
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