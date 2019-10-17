import { useEffect, useState, useCallback } from 'react';
import { getAllCourses, createCourse } from '../../utils/QuizRequests';
import Router from 'next/router';
import { BackOfficeLayoutWrapper } from '../../components/BackOfficeLayoutWrapper';
import GenericDailog from '../../components/GenericDailog';
import TextInput from '../../components/TextInput';
import PrimaryButton from '../../components/PrimaryButton';

export default () => {

    const [courses, setCourses] = useState([]);
    const [isCreateNewCourseInProgress, setIsCreateNewCourseInProgress] = useState(false);

    useEffect(() => {
        (async () => {
            const courses = await getAllCourses();
            setCourses(courses);
        })();
    }, []);

    const onTileClick = useCallback((courseId) => {
        Router.push(`/backoffice/courses/${courseId}/quizzes`);
    }, []);

    const createCourseCallback = useCallback(() => {
        setIsCreateNewCourseInProgress(true);
    }, []);

    const onDismissCreateCourseProcess = useCallback(() => {
        setIsCreateNewCourseInProgress(false);
    }, []);

    const onCreateCourseCallback = useCallback(async (newCourseName) => {
        setIsCreateNewCourseInProgress(false);
        const newCourse = await createCourse(newCourseName);
        setCourses([...courses, newCourse]);
    }, [courses]);

    return (
        <BackOfficeLayoutWrapper>
            <>
                <main>
                    <div className="tiles-container" >
                        {courses.map((course, index) => {
                            return (
                                <Tile
                                    id={course.id}
                                    title={course.courseName}
                                    key={index}
                                    onClick={onTileClick} />
                            )
                        })}
                    </div>
                    <img
                        title="Create new course"
                        className="add-course-fab"
                        src="/static/create_fab.svg"
                        onClick={createCourseCallback} />
                    {isCreateNewCourseInProgress ?
                        <CreateCourseDialog
                            onDismissDialog={onDismissCreateCourseProcess}
                            onCreateCourse={onCreateCourseCallback} />
                        :
                        null}
                </main>
                <style jsx>
                    {`
                    header {
                        height: 140px;
                    } 
                    main {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 20px;
                        padding-bottom: 0px;
                        position: relative;
                    }
                    
                    .tiles-container { 
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: center;
                        margin: -13px -13px;
                    }
                    .add-course-fab {
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

const Tile = ({ id, title, onClick }) => {
    const onTileClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <>
            <div className="course-tile">
                <span className="tile-title">
                    {title}
                </span>
                <button className="see-quizes" onClick={onTileClick}><span>See quizes</span></button>
                <button className="see-members"><span>See members</span></button>
            </div>
            <style jsx>
                {`
            .course-tile {
                        width: 350px;
                        padding: 25px;
                        position: relative;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.4);
                        border-radius: 5px;
                        margin: 13px;
                        display: flex;
                        flex-direction: column;
                        font-size: 1.9em;
                        color: black;
                        transition: all 0.3s;
                        animation: SlideUp 0.3s;
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
            .tile-title {
                margin-bottom: 20px;
            }
            button {
                padding: 10px;
                font-family: 'Oswald';
                font-size: 0.7em;
                margin-bottom: 10px;
                border: none;
                outline: none;
                text-align: left;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.3s;
                display: flex;
                padding-right: 20px;
            }
            button:hover {
                background-color: #669FBD;
                color: white;
                box-shadow: 0px 0px 8px #669FBD;
            }
            button:hover::after {
                content: ">";
                display: inline-block;
                flex-grow: 1;
                text-align: right;
                color: white;
            }
            `}
            </style>
        </>
    )
}

const CreateCourseDialog = ({ onDismissDialog, onCreateCourse }) => {
    const [newCourseTitle, setNewCourseTitle] = useState("");

    const onCreateCourseClick = useCallback(() => {
        onCreateCourse(newCourseTitle);
    }, [newCourseTitle, onCreateCourse]);

    return (
        <>
            <GenericDailog onDismissDialog={onDismissDialog} title="Create new course">
                <TextInput
                    title="New course name:"
                    value={newCourseTitle}
                    valueSetter={setNewCourseTitle}
                    placeholder="New course name here..." />
                <PrimaryButton
                    title="Create course"
                    inactive={!newCourseTitle}
                    rightAligned
                    onClick={newCourseTitle ? onCreateCourseClick : null}
                />
            </GenericDailog>
            <style jsx>
                {`
                `}
            </style>
        </>
    )
}