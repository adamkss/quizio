import GenericDailog from "./GenericDailog";
import PrimaryButton from "./PrimaryButton";

export default ({title, onConfirm, onCancel}) => {
    return (
        <>
        <GenericDailog title={title} onDismissDialog={onCancel}>    
            <div className="confirmation-options">
                <PrimaryButton title="Yes" onClick={onConfirm} marginRight red/>
                <PrimaryButton title="No" onClik={onCancel}/>
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