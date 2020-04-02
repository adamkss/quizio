import GenericDialog from '../../GenericDailog';
import PrimaryButton from '../../PrimaryButton';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Code } from '../Code';
import lodash from 'lodash';
import { getAllFinishedEntryCodesOfATest, updateEntryCodeName, searchFinishedEntryCodes } from '../../../utils/TestRequests';
import { SecondStepInput, getNewEntryCodesArrayWithModifiedElement } from './GenerateNewCodesDialog';

export const ViewFinishedCodesDialog = ({ testId, onDismissDialog, ...rest }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [entryCodes, setEntryCodes] = useState([]);
    const [initialEntryCodes, setInitialEntryCodes] = useState([]);
    const [codeIdToEditNameOf, setCodeIdToEditNameOf] = useState(null);
    const [codeNameToEdit, setCodeNameToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);

    const searchFunctionRef = useRef(lodash.throttle((async (searchTerm, testId, initialCodes) => {
        if (searchTerm) {
            setIsLoading(true);
            const searchedResults = await searchFinishedEntryCodes(testId, searchTerm);
            setEntryCodes(searchedResults);
            setIsLoading(false);
        } else {
            setEntryCodes(initialCodes);
        }
    }), 300));

    const loadEntryCodesIntoInitial = useCallback(async () => {
        const entryCodes = await getAllFinishedEntryCodesOfATest(testId);
        setInitialEntryCodes(entryCodes);
    }, [testId]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const entryCodes = await getAllFinishedEntryCodesOfATest(testId);
            setEntryCodes(entryCodes);
            setInitialEntryCodes(entryCodes);
            setIsLoading(false);
        })();
    }, [testId]);

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

    const onSaveEntryCodeNameEdit = useCallback(async () => {
        setIsLoading(true);
        const result = await updateEntryCodeName(
            testId,
            codeIdToEditNameOf,
            codeNameToEdit
        )
        if (result.status == 200) {
            setEntryCodes(
                getNewEntryCodesArrayWithModifiedElement(
                    entryCodes,
                    codeIdToEditNameOf,
                    {
                        name: codeNameToEdit
                    }
                )
            )
        }
        if (searchTerm)
            loadEntryCodesIntoInitial();
        onCancelEntryCodeNameEdit();
        setIsLoading(false);
    }, [codeIdToEditNameOf, codeNameToEdit, searchTerm, loadEntryCodesIntoInitial]);

    const onSearchChange = useCallback((event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        searchFunctionRef.current(searchTerm, testId, initialEntryCodes);
    }, [testId, initialEntryCodes]);

    return (
        <>
            <GenericDialog loading={isLoading} onDismissDialog={onDismissDialog} {...rest} title="View finished codes">
                <div className="dialog-content">
                    <div className="codes-list">
                        <span className="section-title">List with all the finished entry codes:</span>
                        <div className="table">
                            <div className="table-header">
                                <span>Code</span>
                                <span>Name</span>
                                <span>Result</span>
                            </div>
                            <div className="table-search">
                                <input
                                    placeholder="Search here..."
                                    type="text"
                                    className="table-search-input"
                                    value={searchTerm}
                                    onChange={onSearchChange} />
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
                                            <span onClick={getOnClickCodeNameCallback(entryCode.id, index)}>{entryCode.name || 'Not set'}</span>
                                        }
                                        <span>{entryCode.result}%</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <PrimaryButton
                        title="Done"
                        secondary
                        marginTop
                        rightAligned
                        onClick={onDismissDialog}
                    />
                </div>
            </GenericDialog>
            <style jsx>
                {`
                .buttons-container {
                    display: flex;
                    margin-top: 20px;
                }
                .codes-list {
                    
                }
                .section-title {
                    display: block;
                    font-size: 1.3em;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 300;
                    margin-top: 10px;
                    pointer-events: none;
                }
                .description {
                    display: block;
                    color: rgba(0, 0, 0, 0.8);
                    font-weight: 300;
                    font-size: 1.1em;
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
                    text-align: center;
                }
                .table-row,
                .table-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 1fr;
                    align-items: center;
                    justify-items: center;
                }
                .table-row {
                    padding: 8px;
                }
                .table-header {
                    padding: 5px;
                    border-bottom: 1px solid grey;
                    font-size: 1.2em;
                }
                .table-header span {
                    text-align: center;
                }
                .table-search {
                    display: grid;
                    grid-template-columns: 1fr;
                }
                .table-search-input {
                    border: none;
                    outline: none;
                    font-family: inherit;
                    padding: 5px;
                    padding-left: 7px;
                    font-size: 1.15em;
                    font-weight: 300;
                    border-bottom: 1px solid rgba(0,0,0,0.3);
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