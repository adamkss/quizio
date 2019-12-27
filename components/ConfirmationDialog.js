import GenericDailog from "./GenericDailog";
import PrimaryButton from "./PrimaryButton";

export default ({ title, onConfirm, onCancel, positiveAnswer = "Yes", negativeAnswer = "No", positiveIsRed = false }) => {
    return (
        <>
            <GenericDailog title={title} onDismissDialog={onCancel}>
                <div className="confirmation-options">
                    <PrimaryButton
                        title={negativeAnswer}
                        onClick={onCancel}
                        marginRight
                        color={positiveIsRed ? "green" : "red"} />
                    <PrimaryButton
                        title={positiveAnswer}
                        onClick={onConfirm}
                        color={positiveIsRed ? "red" : "green"} />
                </div>
            </GenericDailog>
            <style jsx>
                {`
                .confirmation-options {
                    display: flex;
                    width: 100%;
                    justify-content: flex-end;
                }
            `}
            </style>
        </>
    )
}