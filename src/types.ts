export interface CurriculumTemplate {
  id: string;
  title: string;
  university: string;
  totalUnitsRequired: number;
  groups: CourseGroup[];
}

export interface CourseGroup {
  id: string;
  title: string;
  requiredUnits: number;
  overflowTargetGroupId?: string;
  courses: Course[];
}

export interface Course {
  id: string;
  title: string;
  units: number;
  prerequisites: string[];
  corequisites: string[];
  description?: string;
}

export interface UserProgress {
  templateId: string;
  passedCourses: PassedCourse[];
}

export interface PassedCourse {
  courseId: string;
  term: number;
  grade?: number;
}
