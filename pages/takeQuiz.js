import { getAllCourses, getQuizesForCourse } from "../utils/QuizRequests";
import LayoutSetup from '../components/layoutSetup';

export default () => {
    const [courses, setCourses] = React.useState([]);
    const [quizesByCourseIdMap, setQuizesByCourseIdMap] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            setCourses(await getAllCourses());
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            const quizesWithCourseId = await Promise.all(courses.map(course =>
                new Promise(async (resolve, reject) => {
                    const quizes = await getQuizesForCourse(course.id);
                    resolve({
                        courseId: course.id,
                        quizes
                    })
                })
            ));
            setQuizesByCourseIdMap(
                quizesWithCourseId.reduce(
                    (array, quizesWithCourseId) => {
                        array[quizesWithCourseId.courseId] = quizesWithCourseId.quizes;
                        return array;
                    }
                    , []
                ));
        })();
    }, [courses]);

    return (
        <>
            <LayoutSetup />
            <main>
                <section className="courses">
                    {courses.map(course =>
                        <div key={course.id} className="course">
                            <h1>{course.courseName}</h1>
                            {quizesByCourseIdMap[course.id] ? quizesByCourseIdMap[course.id].map(quiz => {
                                return (
                                    <div key={quiz.id}>
                                        {quiz.name}
                                    </div>
                                )
                            })
                                :
                                null}
                        </div>
                    )}
                </section>
            </main>
            <style jsx>
                {`
                .course {
                    width: 300px;
                    height: 300px;
                    box-shadow: 0px 0px 7px grey;
                    border-radius: 10px;
                    margin: 20px;
                    display: flex;
                    padding: 25px;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                }
                .courses {
                    display: flex;
                    flex-direction: row;
                    font-size: 1.5em;
                }
                button.see-quizzes {
                    outline:none;
                    font-family: inherit;
                    border:none;
                    font-size: 0.9em;
                    cursor: pointer;
                }
            `}
            </style>
        </>
    )
}