import { QuizzesLayoutWrapper } from "../../components/quizzes/QuizzesLayoutWrapper"
import { useEffect, useState, useCallback } from "react"
import { getAllTestsOfUser, createTest } from "../../utils/TestRequests";
import GenericDialog from '../../components/GenericDailog';
import PrimaryButton from '../../components/PrimaryButton';
import TextInput from '../../components/TextInput';
import Router from "next/router";
import withAuthSetUp from "../../hocs/withAuthSetUp";

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [isCreatingNewTestInProgress, setIsCreatingNewTestInProgress] = useState(false);

    const loadTestsOfUser = useCallback(async () => {
        const tests = await getAllTestsOfUser();
        setTests(tests);
    }, [getAllTestsOfUser]);

    useEffect(() => {
        loadTestsOfUser();
    }, [loadTestsOfUser]);

    const onCreateNewTestPress = useCallback(() => {
        setIsCreatingNewTestInProgress(true);
    }, []);

    const onDismissCreateNewTestDialog = useCallback(() => {
        setIsCreatingNewTestInProgress(false);
    }, []);

    const onCreateNewTest = useCallback(async (testName) => {
        await createTest(testName);
        await loadTestsOfUser();
        onDismissCreateNewTestDialog();
    }, [onDismissCreateNewTestDialog, createTest, loadTestsOfUser]);

    const generateOnGoToEditorCallback = React.useCallback((testId) => {
        return () => {
            Router.push(`/schools/${testId}/editor`);
        }
    }, [Router])
    return (
        <>
            <QuizzesLayoutWrapper>
                <main>
                    {tests.map(test =>
                        <div className="test" key={test.id}>
                            <h2>{test.name}</h2>
                            <button className="test-operation-button" onClick={generateOnGoToEditorCallback(test.id)}>
                                Open test editor
                                </button>
                            <button className="test-operation-button">
                                See results
                                </button>
                            <button className="test-operation-button">
                                Generate entry codes
                                </button>
                            <img
                                title="Delete test"
                                className="delete-test-icon"
                                src="/static/delete-24px.svg"
                            />
                        </div>
                    )}
                    <button className="icon-button">
                        <img
                            title="Create new quiz"
                            className="add-test-fab"
                            src="/static/create_fab.svg"
                            onClick={onCreateNewTestPress}
                        />
                    </button>
                    {isCreatingNewTestInProgress ?
                        <CreateNewTestDialog
                            onDismissDialog={onDismissCreateNewTestDialog}
                            onCreateNewTest={onCreateNewTest} />
                        :
                        null
                    }
                </main>
            </QuizzesLayoutWrapper>
            <style jsx>
                {`
                    main {
                        padding: 20px;
                    }
                    .add-test-fab {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        position: fixed;
                        right: 25px;
                        bottom: 25px;
                        cursor: pointer;
                    }
                    .test {
                        padding: 25px 25px;
                        padding-top: 40px;
                        font-size: 1.9em;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
                        border-radius: 5px;
                        transition: all 0.3s;
                        background-color: white;
                        margin: 13px;
                        animation: SlideUp 0.3s;
                        position: relative;
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
                    .test-operation-button {
                        width: 100%;
                        display: block;
                        background-color: white;
                        outline: none;
                        border: none;
                        font-family: inherit;
                        font-size: 0.7em;
                        padding: 10px;
                        margin: 0;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: all 0.3s;
                        margin-bottom: 10px;
                        text-align: left;
                    }
                    .test-operation-button:hover {
                        background-color: #103A67;
                        color: white;
                        box-shadow: 0px 0px 5px #103A67;
                    }
                    .delete-test-icon {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        cursor: pointer;
                        opacity: 0.5;
                        transition: all 0.3s;
                    }
                    .test:hover .delete-test-icon {
                        opacity: 1;
                    }
            `}
            </style>
        </>
    )
}

const CreateNewTestDialog = ({ onDismissDialog, onCreateNewTest }) => {
    const [newTestName, setNewTestName] = useState("");
    const onSavePress = useCallback(() => {
        onCreateNewTest(newTestName);
    }, [newTestName, onCreateNewTest]);

    return (
        <GenericDialog title="Create new test" onDismissDialog={onDismissDialog}>
            <TextInput title="New test name:"
                value={newTestName}
                autoFocus
                width="100%"
                placeholder="New test name here..."
                valueSetter={setNewTestName} />
            <PrimaryButton
                rightAligned
                title="Create test"
                marginTop
                medium
                inactive={newTestName === ""}
                onClick={onSavePress} />
        </GenericDialog>
    )
}

export default withAuthSetUp(Tests);