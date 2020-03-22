import GenericDialog from '../../GenericDailog';
import PrimaryButton from '../../PrimaryButton';
import { useState, useCallback, useEffect } from 'react';
import { Code } from '../Code';
import { getAllUnfinishedEntryCodesOfATest } from '../../../utils/TestRequests';

export const ViewUnfinishedCodesDialog = ({ testId, onDismissDialog, ...rest }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [entryCodes, setEntryCodes] = useState([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const entryCodes = await getAllUnfinishedEntryCodesOfATest(testId);
            setEntryCodes(entryCodes);
            setIsLoading(false);
        })();
    }, [testId]);

    return (
        <>
            <GenericDialog loading={isLoading} onDismissDialog={onDismissDialog} {...rest} title="View unfinished codes">
                <div className="dialog-content">
                    <div className="codes-list">
                        <span className="section-title">A list with all the unfinished entry codes.</span>
                        <div className="table">
                            <div className="table-header">
                                <span>Code</span>
                                <span>Name</span>
                                <span>Status</span>
                            </div>
                            <div className="table-rows">
                                {entryCodes.map((entryCode) =>
                                    <div className="table-row" key={entryCode.id}>
                                        <Code
                                            key={entryCode.code}
                                            code={entryCode.code}
                                            inversedColors />
                                        <span>{entryCode.name || 'Not set'}</span>
                                        <span>{entryCode.status}</span>
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