import { useEffect } from 'react';
import { getQuizesForCourse } from '../../../../utils/QuizRequests';
import { useRouter } from 'next/router';
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
    return (
        <BackOfficeLayoutWrapper>
            <>
                <main>
                    <section className="quizes">
                        {quizes.map(quiz =>
                            <div className="quiz" key={quiz.id}>
                                <span>{quiz.name}</span>
                            </div>
                        )}
                    </section>

                </main>
                <style jsx>
                    {`
                    main {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 20px;
                    }
                    .quizes {
                        width: 65vw;
                        border-radius: 5px;
                        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
                    }
                    .quiz {
                        padding-top: 8px;
                        padding-bottom: 8px;
                        padding-left: 15px;
                        width: 100%;
                        height: 50px;
                        font-size: 1.3em;
                        border-bottom: 1px solid #cfcccc;
                        cursor: pointer;
                    }
                    .quiz:first-child {
                        border-top-right-radius: 5px;
                        border-top-left-radius: 5px;
                    }
                    .quiz:last-child {
                        border-bottom-right-radius: 5px;
                        border-bottom-left-radius: 5px;
                    }
                    .quiz:hover {
                        background-color: #ebebeb;
                    }
                `}
                </style>
            </>
        </BackOfficeLayoutWrapper>
    )
}