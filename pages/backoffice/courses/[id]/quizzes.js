import { useEffect } from 'react';
import { getQuizesForCourse } from '../../../../utils/QuizRequests';
import Router, { useRouter } from 'next/router';
import { BackOfficeLayoutWrapper } from '../../../../components/BackOfficeLayoutWrapper';

export default () => {
    const { id } = useRouter().query;
    const [quizes, setQuizes] = React.useState([]);

    useEffect(() => {
        (async () => {
            if (id) {
                const quizes = await getQuizesForCourse(id);
                setQuizes(quizes);
            }
        })();
    }, [id]);

    const getOnClickCallbackForQuizPress = (quizId) => () => {
        Router.push(`/backoffice/courses/${id}/quizzes/${quizId}`);
    }

    const onCreateNewQuizPress = () => {

    }

    return (
        <BackOfficeLayoutWrapper>
            <>
                <main>
                    <section className="quizes">
                        {quizes.map(quiz =>
                            <div className="quiz" key={quiz.id}>
                                <h2>{quiz.name}</h2>
                                <button className="quiz-operation-button" onClick={getOnClickCallbackForQuizPress(quiz.id)}>
                                    See questions
                                </button>
                                <button className="quiz-operation-button">
                                    See results of users
                                </button>
                            </div>
                        )}
                    </section>
                    <img
                        title="Create new quiz"
                        className="add-quiz-fab"
                        src="/static/create_fab.svg"
                        onClick={onCreateNewQuizPress}
                         />
                </main>
                <style jsx>
                    {`
                    main {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 20px;
                        position: relative;
                    }
                    .quizes {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .quiz {
                        padding: 25px;
                        font-size: 1.9em;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
                        border-radius: 5px;
                        transition: all 0.3s;
                    }
                    .quiz:hover {
                        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
                    }
                    .quiz h2 {
                        padding: 0;
                        margin: 0;
                        margin-bottom: 10px;
                    }
                    .quiz-operation-button {
                        width: 100%;
                        display: block;
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
                    .quiz-operation-button:hover {
                        background-color: #103A67;
                        color: white;
                        box-shadow: 0px 0px 5px #103A67;
                    }
                    .add-quiz-fab {
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