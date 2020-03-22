import GenericDialog from '../../GenericDailog';
import { NumberInputWithControls } from '../../NumberInputWithControls';
import { ProgressIndicator } from '../../../components/ProgressIndicator';
import PrimaryButton from '../../../components/PrimaryButton';
import { useState, useCallback } from 'react';
import { createNewEntryCodes, updateEntryCodeName } from '../../../utils/TestRequests';
import { Code } from '../Code';

const getNewEntryCodesArrayWithModifiedElement = (oldEntryCodes, entryCodeId, newEntryCode) => {
    let newEntryCodes = [...oldEntryCodes];
    const entryCodeToModifyIndex = newEntryCodes.findIndex(el => el.id === entryCodeId);
    newEntryCodes[entryCodeToModifyIndex] = {
        ...newEntryCodes[entryCodeToModifyIndex],
        ...newEntryCode
    };
    return newEntryCodes;
}

export const GenerateNewCodesDialog = ({ testId, onDismissDialog, ...rest }) => {
    const [step, setStep] = useState(1);
    const [newCodesNumber, setNewCodesNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [newEntryCodes, setNewEntryCodes] = useState([]);

    const onNextPress = useCallback(async () => {
        switch (step) {
            case 1:
                setIsLoading(true);
                const newEntryCodes = await createNewEntryCodes(testId, newCodesNumber);
                setIsLoading(false);
                setNewEntryCodes(newEntryCodes);
                setStep(2);
                break;
            case 2: {
                onDismissDialog();
                break;
            }
        }
    }, [step, newCodesNumber, testId, onDismissDialog]);

    const onUpdateEntryCodeName = useCallback(async (entryCodeId, newName) => {
        setIsLoading(true);
        const result = await updateEntryCodeName(
            testId,
            entryCodeId,
            newName
        )
        if (result.status == 200) {
            setNewEntryCodes(
                getNewEntryCodesArrayWithModifiedElement(
                    newEntryCodes,
                    entryCodeId,
                    {
                        name: newName
                    }
                )
            )
        }
        setIsLoading(false);
    }, [testId, newEntryCodes]);

    return (
        <>
            <GenericDialog loading={isLoading} onDismissDialog={onDismissDialog} {...rest} title="Generate new codes">
                <div className="dialog-content">
                    <ProgressIndicator
                        numberOfSteps={2}
                        currentStep={step}
                        paddingPx={9} />
                    {step == 1 ?
                        <FirstStep setNewCodesNumber={setNewCodesNumber} />
                        :
                        ``
                    }
                    {step == 2 ?
                        <SecondStep
                            testId={testId}
                            entryCodes={newEntryCodes}
                            onUpdateEntryCodeName={onUpdateEntryCodeName} />
                        :
                        ``
                    }
                    {isLoading ?
                        ``
                        :
                        null
                    }
                    <div className="buttons-container">
                        <PrimaryButton
                            title="Cancel"
                            secondary
                            onClick={onDismissDialog}
                        />
                        <PrimaryButton
                            inactive={newCodesNumber == 0}
                            title={step === 1 ? 'Next' : 'Finish'}
                            color="blue"
                            medium
                            rightAligned
                            onClick={onNextPress} />
                    </div>
                </div>
            </GenericDialog>
            <style jsx>
                {`
                .buttons-container {
                    display: flex;
                    margin-top: 20px;
                }
                `}
            </style>
        </>
    )
}

const FirstStep = ({ setNewCodesNumber }) => {
    return (
        <>
            <div>
                <span className="section-title">Number of new codes:</span>
                <div className="horizontally-centered">
                    <NumberInputWithControls width="300px" minimum={0} valueSetter={setNewCodesNumber} />
                </div>
                <span className="description">
                    Enter the number of new codes here.
                    </span>
                <span className="description-second-line">
                    You can also manually input the number.
                    </span>
            </div>
            <style jsx>
                {`
                .section-title {
                    display: block;
                    font-size: 1.3rem;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 300;
                    margin-bottom: 15px;
                    margin-top: 10px;
                    pointer-events: none;
                }
                .description {
                    display: block;
                    text-align: center;
                    color: rgba(0, 0, 0, 0.8);
                    font-weight: 300;
                    margin-top: 8px;
                    pointer-events: none;
                }
                .description-second-line {
                    display: block;
                    text-align: center;
                    color: rgba(0, 0, 0, 0.8);
                    font-weight: 300;
                    pointer-events: none;
                }
            `}
            </style>
        </>
    )
}

const SecondStep = ({ testId, entryCodes = [], onUpdateEntryCodeName }) => {
    const [codeIdToEditNameOf, setCodeIdToEditNameOf] = useState(null);
    const [codeNameToEdit, setCodeNameToEdit] = useState(null);

    const getOnClickCodeNameCallback = useCallback((codeId, index) => () => {
        setCodeIdToEditNameOf(codeId);
        setCodeNameToEdit(entryCodes[index].name || '');
    }, [entryCodes]);

    const onCodeNameToEditChange = useCallback((event) => {
        setCodeNameToEdit(event.target.value);
    }, []);

    const onCancelEntryCodeNameEdit = useCallback(() => {
        setCodeIdToEditNameOf(null);
        setCodeNameToEdit(null);
    }, []);

    const onSaveEntryCodeNameEdit = useCallback(() => {
        onUpdateEntryCodeName(codeIdToEditNameOf, codeNameToEdit);
        onCancelEntryCodeNameEdit();
    }, [codeIdToEditNameOf, codeNameToEdit]);

    return (
        <>
            <div className="codes-list">
                <span className="section-title">Would you like to assign names to your codes?</span>
                <span className="description">Assigning a name to your codes lets you identify results and query them easily.</span>
                <div className="table">
                    <div className="table-header">
                        <span>Code</span>
                        <span>Name</span>
                    </div>
                    <div className="table-rows">
                        {entryCodes.map((entryCode, index) =>
                            <div className="table-row" key={entryCode.id}>
                                <Code
                                    key={entryCode.code}
                                    code={entryCode.code}
                                    inversedColors />
                                {codeIdToEditNameOf === entryCode.id ?
                                    <div className="modify-entry-code-name-wrapper">
                                        <SecondStepInput value={codeNameToEdit} valueSetter={onCodeNameToEditChange} />
                                        <img title="Cancel" src="/static/exit-icon.svg" className="exit-icon" onClick={onCancelEntryCodeNameEdit} />
                                        <img title="Save question option" src="/static/check_circle_black.svg" className="" onClick={onSaveEntryCodeNameEdit} />
                                    </div>
                                    :
                                    <span
                                        className="code-name"
                                        onClick={getOnClickCodeNameCallback(entryCode.id, index)}>{entryCode.name || "Not set."}</span>
                                }
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <style jsx>
                {`
                .codes-list {
                    
                }
                .section-title {
                    display: block;
                    font-size: 1.3rem;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 300;
                    margin-top: 10px;
                    pointer-events: none;
                }
                .description {
                    display: block;
                    color: rgba(0, 0, 0, 0.8);
                    font-weight: 300;
                    font-size: 1.1rem;
                    pointer-events: none;
                }
                .table {
                    display: flex;
                    flex-direction: column;
                    border: 1px solid grey;
                    border-radius: 10px;
                    margin-top: 10px;
                }
                .table-rows {
                    max-height: 200px;
                    overflow: auto;
                }
                .table-row,
                .table-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr;
                    align-items: center;
                }
                .table-row {
                    padding: 8px;
                }
                .table-header {
                    padding: 5px;
                    border-bottom: 1px solid grey;
                    font-size: 1.2rem;
                }
                .table-header span {
                    text-align: center;
                }
                .table-row:not(:last-child) {
                    border-bottom: 1px solid grey;
                }
                .code-name {
                    text-align: center;
                    font-weight: 300;
                    padding: 5px;
                }
                .modify-entry-code-name-wrapper {
                    display: grid;
                    grid-template-columns: 1fr 30px 30px;
                    align-items: center;
                    justify-items: center;
                }
                .exit-icon {
                    width: 21px;
                }
            `}
            </style>
        </>

    )
}

const SecondStepInput = ({ value, valueSetter }) => {
    return (
        <>
            <input autoFocus type="text" value={value} onChange={valueSetter} />
            <style jsx>
                {`
                input {
                    outline: none;
                    border: none;
                    font-family: inherit;
                    font-size: inherit;
                    text-align: center;
                    font-weight: 300;
                    border: 1px solid rgba(0,0,0,0.2);
                    padding: 3px;
                }
            `}
            </style>
        </>
    )
}