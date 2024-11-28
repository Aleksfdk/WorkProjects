import {
  ICourse,
  ICourseBody,
  ICourseById,
  ICourseParams,
  IEditCourseParams,
  IPictureCourseById,
  IUploadMutationParams
} from 'types/entities';

export module ICourses {
  export type Response = ICourse[];
  export type Params = ICourseParams;
}

export module ICourseById {
  export type Response = ICourseById;
  export type Params = string;
}

export module ISaveCourse {
  export type Response = ICourseBody;
  export type Params = ICourseBody;
}

export module IEditCourse {
  export type Response = ICourseBody;
  export type Params = IEditCourseParams;
}

export module IUploadMutation {
  export type Response = void;
  export type Params = IUploadMutationParams;
}

export module IRemoveCourse {
  export type Response = void;
  export type Params = string;
}

export module IRemovePictureCourse {
  export type Response = void;
  export type Params = IPictureCourseById;
}
