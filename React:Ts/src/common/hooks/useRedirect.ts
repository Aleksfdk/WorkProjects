import { Search, useNavigate } from 'react-router-dom';
import { getFallback } from 'common/helpers/getFallback';
import { setPathIds } from 'common/helpers/setPathIds';
import { useAppSelector } from 'common/hooks';
import { profileSelectors } from 'api/student/profile/profile.selectors';
import { guestPaths } from 'types/routes/guest';
import { instructorPaths } from 'types/routes/instructor';
import { studentPaths } from 'types/routes/student';

type Empty = Record<string, unknown>;
type RedirectFn<T> = ({}: T & { search?: Search }) => void;

interface IRedirect {
  // redirect user by role to the default page
  fallback: RedirectFn<Empty>;
  // Guest
  root: RedirectFn<Empty>;
  catalog: RedirectFn<Empty>;
  news: RedirectFn<Empty>;
  notFound: RedirectFn<Empty>;
  // Student
  myCourses: RedirectFn<Empty>;
  courseFolder: RedirectFn<{ id: string }>;
  course: RedirectFn<{ id: string }>;
  coursePreview: RedirectFn<{ id: string }>;
  profile: RedirectFn<Empty>;
  achievements: RedirectFn<Empty>;
  main: RedirectFn<Empty>;
  education: RedirectFn<{ trainingId: string; exerciseId: string }>;
  // Instructor
  courseCreate: RedirectFn<Empty>;
  courseEdit: RedirectFn<{ courseId: string }>;
  exerciseSlidesEdit: RedirectFn<{ lessonId: string; exerciseId: string; programId: string; type: string; slideId: string }>;
  exerciseSlidesCreate: RedirectFn<{ lessonId: string; exerciseId: string; programId: string; type: string }>;
  instructorCourseFolder: RedirectFn<{ id: string }>;
  instructorCourse: RedirectFn<{ id: string }>;
  instructorCourses: RedirectFn<Empty>;
  company: RedirectFn<Empty>;
  events: RedirectFn<Empty>;
  landing: RedirectFn<Empty>;
  reviews: RedirectFn<Empty>;
  detailedEvent: RedirectFn<{ id: string }>;
  editEvent: RedirectFn<{ id: string }>;
  newEvent: RedirectFn<Empty>;
  newProgram: RedirectFn<Empty>;
  newProgramLesson: RedirectFn<{ id: string }>;
  editProgramLesson: RedirectFn<{ id: string; lessonId: string }>;
  programExerciseSort: RedirectFn<{ courseId: string; lessonId: string }>;
  editProgram: RedirectFn<{ id: string }>;
  programs: RedirectFn<Empty>;
  detailedProgram: RedirectFn<{ id: string }>;
  editAuthors: RedirectFn<{ id: string }>;
  programsSort: RedirectFn<{ id: string }>;
  exerciseCreate: RedirectFn<{ programId: string; lessonId: string }>;
  exerciseEdit: RedirectFn<{ programId: string; lessonId: string; exerciseId: string }>;
  createScorm: RedirectFn<{ programId: string; lessonId: string }>;
  exerciseSlides: RedirectFn<{ programId: string; lessonId: string; exerciseId: string }>;
  exerciseConstraints: RedirectFn<{ programId: string; lessonId: string; exerciseId: string }>;
  lessonConstraints: RedirectFn<{ programId: string; lessonId: string }>;
  coursesList: RedirectFn<Empty>;
  coursesUsers: RedirectFn<Empty>;
  programReflection: RedirectFn<{ programId: string }>;
  copy: RedirectFn<{ id: string }>;
  detailedProgramMassDelete: RedirectFn<{ id: string }>;
  exerciseReflection: RedirectFn<{ programId: string; exerciseId: string }>;
  coursesSort: RedirectFn<{ courseId: string }>;
  courseInstructors: RedirectFn<{ trainingId: string }>;
  joiningTutor: RedirectFn<{ trainingId: string; id: string }>;
  visitLog: RedirectFn<{ courseId: string }>;
  files: RedirectFn<{ programId: string; lessonId: string; exerciseId: string }>;
  feedbackInstructors: RedirectFn<{ trainingId: string; exerciseId: string }>;
  invite: RedirectFn<{ id: string }>;
  viewRights: RedirectFn<{ accountId: string }>;
  studentsManagement: RedirectFn<{ courseId: string }>;
  studyGroups: RedirectFn<{ courseId: string }>;
  studentsJournal: RedirectFn<{ courseId: string }>;
  courseRegistration: RedirectFn<Empty>;
  specificExercise: RedirectFn<{ courseId: string; exerciseId: string }>;
  queueTasks: RedirectFn<Empty>;
  courseLinks: RedirectFn<{ id: string }>;
  studentsCourses: RedirectFn<{ accountId: string }>;
  createCertificate: RedirectFn<{ nameCert: string }>;
  detailedCertificate: RedirectFn<{ tempId: string; record: any }>;
  certificateGeneration: RedirectFn<{ courseId: string }>;
  licenses: RedirectFn<{ courseId: string }>;
  createInterrogation: RedirectFn<Empty>;
  editInterrogation: RedirectFn<{ id: string }>;
  previewEducation: RedirectFn<{ trainingId: string; exerciseId: string; lessonId: string }>;
  resources: RedirectFn<Empty>;
  instructorsHierarchicalAdd: RedirectFn<{ id: string }>;
  studentsHierarchicalAdd: RedirectFn<{ id: string }>;
  instructorNotifications: RedirectFn<{ id: string }>;
  createTempTest: RedirectFn<Empty>;
  editTempTest: RedirectFn<{ templateId: string }>;
  exerciseTest: RedirectFn<{ programId: string; lessonId: string; exerciseId: string }>;
  surveysPassing: RedirectFn<{ id: string }>;
  studentProfile: RedirectFn<{ studentId: string }>;
  // Move
  move: RedirectFn<{ number: number }>;
}

export const useRedirect = (): IRedirect => {
  const navigate = useNavigate();
  const role = useAppSelector(profileSelectors.role);

  return {
    // Fallback
    fallback: (options) => navigate({ pathname: getFallback(role), search: options?.search }),
    // Guest
    root: (options) => {
      navigate({ pathname: guestPaths.root, search: options?.search });
    },
    catalog: (options) => {
      navigate({ pathname: guestPaths.catalog, search: options?.search });
    },
    news: (options) => {
      navigate({ pathname: guestPaths.news, search: options?.search });
    },
    notFound: (options) => {
      navigate({ pathname: guestPaths.notFound, search: options?.search });
    },
    // Student
    myCourses: (options) => {
      navigate({ pathname: studentPaths.myCourses, search: options?.search });
    },
    courseFolder: ({ id, search }) => {
      navigate({ pathname: setPathIds(studentPaths.courseFolder, { id }), search });
    },
    course: ({ id, search }) => {
      navigate({ pathname: setPathIds(studentPaths.course, { id }), search });
    },
    coursePreview: ({ id, search }) => {
      navigate({ pathname: setPathIds(studentPaths.previewCourse, { id }), search });
    },
    profile: (options) => {
      navigate({ pathname: studentPaths.profile, search: options?.search });
    },
    achievements: (options) => {
      navigate({ pathname: studentPaths.achievements, search: options?.search });
    },
    main: (options) => {
      navigate({ pathname: studentPaths.myCourses, search: options?.search });
    },
    education: ({ exerciseId, search, trainingId }) => {
      navigate({ pathname: setPathIds(studentPaths.education, { exerciseId, trainingId }), search });
    },
    // Instructor
    courseCreate: (options) => {
      navigate({ pathname: instructorPaths.courseCreate, search: options?.search });
    },
    courseEdit: ({ courseId }) => {
      navigate({ pathname: setPathIds(instructorPaths.courseEdit, { courseId }) });
    },
    exerciseSlidesEdit: ({ programId, lessonId, exerciseId, slideId, type }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseSlidesEdit, { programId, lessonId, exerciseId, slideId, type }) });
    },
    exerciseSlidesCreate: ({ programId, lessonId, exerciseId, type }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseSlidesCreate, { programId, lessonId, exerciseId, type }) });
    },
    instructorCourseFolder: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.courseFolder, { id }), search });
    },
    instructorCourse: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.course, { id }), search });
    },
    instructorCourses: (options) => {
      navigate({ pathname: instructorPaths.courses, search: options?.search });
    },
    company: (options) => {
      navigate({ pathname: instructorPaths.company, search: options?.search });
    },
    events: (options) => {
      navigate({ pathname: instructorPaths.events, search: options?.search });
    },
    landing: (options) => {
      navigate({ pathname: instructorPaths.landingMaker, search: options?.search });
    },
    reviews: (options) => {
      navigate({ pathname: instructorPaths.reviews, search: options?.search });
    },
    detailedEvent: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.detailedEvent, { id }), search });
    },
    newEvent: (options) => {
      navigate({ pathname: instructorPaths.newEvent, search: options?.search });
    },
    editEvent: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.editEvent, { id }), search });
    },
    editProgram: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.editProgram, { id }), search });
    },
    newProgram: (options) => {
      navigate({ pathname: instructorPaths.newProgram, search: options?.search });
    },
    newProgramLesson: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.newProgramLesson, { id }), search });
    },
    editProgramLesson: ({ id, search, lessonId }) => {
      navigate({ pathname: setPathIds(instructorPaths.editProgramLesson, { id, lessonId }), search });
    },
    programs: (options) => {
      navigate({ pathname: instructorPaths.programs, search: options?.search });
    },
    detailedProgram: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.detailedProgram, { id }), search });
    },
    editAuthors: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.editAuthors, { id }), search });
    },
    programsSort: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.programSort, { id }), search });
    },
    programExerciseSort: ({ courseId, search, lessonId }) => {
      navigate({ pathname: setPathIds(instructorPaths.programExerciseSort, { courseId, lessonId }), search });
    },
    exerciseCreate: ({ programId, lessonId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseCreate, { programId, lessonId }), search });
    },
    exerciseEdit: ({ programId, lessonId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseEdit, { programId, lessonId, exerciseId }), search });
    },
    createScorm: ({ programId, lessonId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.scorm, { programId, lessonId }), search });
    },
    exerciseSlides: ({ programId, lessonId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseSlides, { programId, lessonId, exerciseId }), search });
    },
    exerciseConstraints: ({ programId, lessonId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseConstraints, { programId, lessonId, exerciseId }), search });
    },
    lessonConstraints: ({ programId, lessonId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.lessonConstraints, { programId, lessonId }), search });
    },
    coursesList: (options) => {
      navigate({ pathname: instructorPaths.coursesList, search: options?.search });
    },
    coursesUsers: (options) => {
      navigate({ pathname: instructorPaths.coursesUsers, search: options?.search });
    },
    viewRights: ({ accountId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.viewRights, { accountId }), search });
    },
    programReflection: ({ programId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.programReflection, { programId }), search });
    },
    copy: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.copy, { id }), search });
    },
    detailedProgramMassDelete: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.massDelete, { id }), search });
    },
    exerciseReflection: ({ programId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseReflection, { programId, exerciseId }), search });
    },
    coursesSort: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.coursesSort, { courseId }), search });
    },
    courseInstructors: ({ trainingId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.courseInstructors, { trainingId }), search });
    },
    joiningTutor: ({ trainingId, id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.joiningTutor, { trainingId, id }), search });
    },
    visitLog: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.visitLog, { courseId }), search });
    },
    files: ({ programId, lessonId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.files, { programId, lessonId, exerciseId }), search });
    },
    feedbackInstructors: ({ trainingId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.feedback, { trainingId, exerciseId }), search });
    },
    invite: ({ id, search }) => {
      navigate({ pathname: setPathIds(studentPaths.invite, { id }), search });
    },
    studentsManagement: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.studentsManagement, { courseId }), search });
    },
    studyGroups: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.studyGroups, { courseId }), search });
    },
    studentsJournal: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.studentsJournal, { courseId }), search });
    },
    courseRegistration: (options) => {
      navigate({ pathname: instructorPaths.courseRegistartion, search: options.search });
    },
    specificExercise: ({ courseId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.specificExercise, { courseId, exerciseId }), search: search });
    },
    queueTasks: (options) => {
      navigate({ pathname: setPathIds(instructorPaths.queueTasks), search: options?.search });
    },
    courseLinks: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.courseLinks, { id }), search });
    },
    studentsCourses: ({ accountId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.studentsCourses, { accountId }), search });
    },
    detailedCertificate: ({ tempId, record, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.certificateDetailed, { tempId }), search }, { state: record });
    },
    createCertificate: ({ nameCert, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.certificateCreate), search }, { state: nameCert });
    },
    certificateGeneration: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.certificateGeneration, { courseId }), search });
    },
    licenses: ({ courseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.licenses, { courseId }), search });
    },
    createInterrogation: (options) => {
      navigate({ pathname: instructorPaths.interrogationCreate, search: options?.search });
    },
    editInterrogation: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.interrogationEdit, { id }), search });
    },
    previewEducation: ({ exerciseId, search, trainingId, lessonId }) => {
      navigate({ pathname: setPathIds(instructorPaths.previewEducation, { exerciseId, trainingId, lessonId }), search });
    },
    resources: (options) => {
      navigate({ pathname: setPathIds(instructorPaths.resources), search: options?.search });
    },
    instructorsHierarchicalAdd: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.instructorsHierarchicalAdd, { id }), search });
    },
    studentsHierarchicalAdd: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.studentsHierarchicalAdd, { id }), search });
    },
    instructorNotifications: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.notifications, { id }), search });
    },
    createTempTest: (options) => {
      navigate({ pathname: instructorPaths.temptTestCreate, search: options?.search });
    },
    editTempTest: ({ templateId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.temptTestEdit, { templateId }), search });
    },
    exerciseTest: ({ programId, lessonId, exerciseId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.exerciseTest, { programId, lessonId, exerciseId }), search });
    },
    surveysPassing: ({ id, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.surveysPassing, { id }), search });
    },
    studentProfile: ({ studentId, search }) => {
      navigate({ pathname: setPathIds(instructorPaths.studentProfile, { studentId }), search });
    },
    // Move
    move: ({ number }) => navigate(number)
  };
};
