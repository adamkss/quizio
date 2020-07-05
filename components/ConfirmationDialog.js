import GenericDailog from "./GenericDailog";
import PrimaryButton from "./PrimaryButton";

export default ({
  title,
  text = null,
  onConfirm,
  onCancel,
  positiveAnswer = "Yes",
  negativeAnswer = "No",
  positiveIsRed = false,
}) => {
  return (
    <>
      <GenericDailog title={title} onDismissDialog={onCancel}>
        {text ? <span className="description-text">{text}</span> : null}
        <div className="confirmation-options">
          <PrimaryButton
            title={negativeAnswer}
            onClick={onCancel}
            medium
            marginRight
            color={positiveIsRed ? "green" : "red"}
            secondary
          />
          <PrimaryButton
            title={positiveAnswer}
            onClick={onConfirm}
            medium
            borderInsteadOfShadow
            color={positiveIsRed ? "white" : "green"}
            textColor={positiveIsRed ? "#ba2232" : "white"}
          />
        </div>
      </GenericDailog>
      <style jsx>
        {`
          .confirmation-options {
            display: flex;
            width: 100%;
            justify-content: flex-end;
            ${text ? "margin-top: 15px;" : ""}
          }
          .description-text {
            font-size: 1.3rem;
            font-weight: 300;
          }
        `}
      </style>
    </>
  );
};
