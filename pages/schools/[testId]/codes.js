import { QuizzesLayoutWrapper } from "../../../components/quizzes/QuizzesLayoutWrapper";
import { Code } from "../../../components/schools/Code";
import { useCallback, useState, useEffect } from "react";
import { GenerateNewCodesDialog } from "../../../components/schools/codes/GenerateNewCodesDialog";
import { ViewUnfinishedCodesDialog } from "../../../components/schools/codes/ViewUnfinishedCodesDialog";
import { ViewFinishedCodesDialog } from "../../../components/schools/codes/ViewFinishedCodesDialog";
import { useRouter } from "next/router";
import withAuthSetUp from "../../../hocs/withAuthSetUp";

const Codes = () => {
  const [
    isGenerateNewCodesInProgress,
    setIsGenerateNewCodesInProgress,
  ] = useState(false);
  const [isViewingUnfinishedCodes, setIsViewingUnfinishedCodes] = useState(
    false
  );
  const [isViewingFinishedCodes, setIsViewingFinishedCodes] = useState(false);
  const { testId, viewFinished } = useRouter().query;

  useEffect(() => {
    if (viewFinished && viewFinished == 'true') {
      setIsViewingFinishedCodes(true);
    }
  }, [viewFinished]);

  const onGenerateCodesTileClick = useCallback(() => {
    setIsGenerateNewCodesInProgress(true);
  }, []);

  const onDismissGenerateCodesDialog = useCallback(() => {
    setIsGenerateNewCodesInProgress(false);
  }, []);

  const onViewUnfinishedCodesClick = useCallback(() => {
    setIsViewingUnfinishedCodes(true);
  }, []);

  const onDismissViewUnfinishedCodesDialog = useCallback(() => {
    setIsViewingUnfinishedCodes(false);
  }, []);

  const onViewFinishedCodesClick = useCallback(() => {
    setIsViewingFinishedCodes(true);
  }, []);

  const onDismissViewFinishedCodesDialog = useCallback(() => {
    setIsViewingFinishedCodes(false);
  }, []);

  return (
    <>
      <QuizzesLayoutWrapper>
        <main>
          <div
            className="tile tile-generate"
            onClick={onGenerateCodesTileClick}
          >
            <h1>Generate new codes</h1>
            <Code code="1234" fontSize="1.7rem" extraCSS={"margin-top: 5px;"} />
          </div>
          <div
            className="tile tile-status"
            onClick={onViewUnfinishedCodesClick}
          >
            <h1>View unfinished code statuses</h1>
            <div className="tile-status__illustration">
              <div className="status-illustration__element">
                <Code code="123a" fontSize="1.2rem" inversedColors />
                <span className="illustration__text">Not accessed</span>
              </div>
              <div className="status-illustration__element">
                <Code code="123b" fontSize="1.2rem" inversedColors />
                <span className="illustration__text">In progress</span>
              </div>
              <div className="status-illustration__element">
                <Code code="123c" fontSize="1.2rem" inversedColors />
                <span className="illustration__text">Abandoned</span>
              </div>
            </div>
          </div>
          <div className="tile tile-results" onClick={onViewFinishedCodesClick}>
            <h1>View finished codes results</h1>
            <div className="results-tile__illustration">
              <div className="results-tile__element">
                <Code code="abc1" fontSize="1.1rem" inversedColors></Code>
                <span className="results-tile__name">John Doe</span>
                <span className="results-tile__grade">90%</span>
              </div>
              <div className="results-tile__element">
                <Code code="abc1" fontSize="1.1rem" inversedColors></Code>
                <span className="results-tile__name">Max Millian</span>
                <span className="results-tile__grade">67%</span>
              </div>
              <div className="results-tile__element">
                <Code code="abc1" fontSize="1.1rem" inversedColors></Code>
                <span className="results-tile__name">Loe Caprio</span>
                <span className="results-tile__grade">100%</span>
              </div>
            </div>
          </div>
        </main>
      </QuizzesLayoutWrapper>
      {isGenerateNewCodesInProgress ? (
        <GenerateNewCodesDialog
          testId={testId}
          onDismissDialog={onDismissGenerateCodesDialog}
        />
      ) : null}
      {isViewingUnfinishedCodes ? (
        <ViewUnfinishedCodesDialog
          testId={testId}
          onDismissDialog={onDismissViewUnfinishedCodesDialog}
        />
      ) : null}
      {isViewingFinishedCodes ? (
        <ViewFinishedCodesDialog
          testId={testId}
          onDismissDialog={onDismissViewFinishedCodesDialog}
        />
      ) : null}
      <style jsx>
        {`
          main {
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-areas:
              "generate"
              "status"
              "results";
            grid-gap: 25px;
            justify-items: center;
            justify-content: center;
          }
          @media (min-width: 1100px) {
            main {
              grid-template-columns: 400px 1fr;
              grid-template-rows: 250px 400px;
              grid-template-areas:
                "generate results"
                "status results";
              justify-items: start;
            }
          }
          .tile {
            border-radius: 10px;
            width: 300px;
            max-width: 98vw;
            padding: 20px;
            color: white;
            transition: all 0.3s;
            filter: brightness(100%);
            animation: TileEntry 1.3s;
            overflow: hidden;
          }
          @keyframes TileEntry {
            0% {
              filter: brightness(100%);
              opacity: 0;
              transform: translateY(-10px);
            }
            30% {
              opacity: 1;
              transform: translateY(0px);
            }
            50% {
              filter: brightness(120%);
            }
            100% {
              filter: brightness(100%);
            }
          }
          .tile:hover,
          .tile * {
            cursor: pointer;
            filter: brightness(105%);
          }
          .tile-generate {
            grid-area: generate;
            height: 200px;
            box-shadow: 3px 3px 10px #3f51b5;
            background-color: hsl(231, 48%, 48%);
          }
          .tile-generate:hover {
            background-color: hsl(231, 48%, 51%);
          }
          .tile-status {
            grid-area: status;
            height: 400px;
            background-color: hsl(267, 76%, 31%);
            box-shadow: 3px 3px 10px #4a148c;
          }
          .tile-status:hover {
            background-color: hsl(267, 76%, 34%);
          }
          .tile-results {
            grid-area: results;
            width: 400px;
            height: 300px;
            background-color: hsl(207, 100%, 38%);
            box-shadow: 3px 3px 10px #0069c0;
          }
          .tile-results:hover {
            background-color: hsl(207, 100%, 41%);
          }
          .tile-status__illustration {
            background-color: white;
            border-radius: 8px;
            padding: 10px;
            color: black;
            margin-top: 35px;
            transform: rotate(-3deg);
          }
          .status-illustration__element {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-bottom: 10px;
          }
          .illustration__text {
            background-color: #e0e0e0;
            padding: 4px;
          }
          .results-tile__illustration {
            background-color: white;
            border-radius: 5px;
            padding: 10px;
            margin-top: 20px;
            transform: rotate(3deg);
          }
          .results-tile__element {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            justify-items: center;
            margin-bottom: 8px;
          }
          .results-tile__name {
            color: black;
          }
          .results-tile__grade {
            color: black;
          }
        `}
      </style>
    </>
  );
};

export default withAuthSetUp(Codes);
