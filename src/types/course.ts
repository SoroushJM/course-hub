// Course Category Types
export type CourseCategory =
  | "general" // دروس عمومی
  | "required-basic" // دروس الزامی-پایه
  | "required-core" // دروس الزامی-هسته مشترک
  | "required-major" // دروس الزامی-رشته
  | "elective-selection" // دروس اختیاری-انتخاب
  | "elective-guided"; // دروس اختیاری/کهاد

// Course Type
export interface Course {
  id: string;
  name: string;
  units: number;
  category: CourseCategory;
  prerequisites: string[]; // Array of course IDs
  corequisites: string[]; // Array of course IDs (همنیاز)
  semester?: number; // Optional semester suggestion
}

// Passed Course
export interface PassedCourse {
  courseId: string;
  passedDate?: string;
}

// Curriculum Type
export interface Curriculum {
  id: string;
  name: string;
  major: string; // e.g., "علوم کامپیوتر"
  degree: string; // e.g., "کارشناسی"
  totalUnits: {
    min: number;
    max: number;
  };
  categoryRequirements: {
    [key in CourseCategory]?: number; // Required units for each category
  };
  courses: Course[];
  createdAt: string;
  updatedAt: string;
}

// Student Progress
export interface StudentProgress {
  curriculumId: string;
  passedCourses: PassedCourse[];
  lastUpdated: string;
}

// Available Course (for display)
export interface AvailableCourse extends Course {
  reason: string; // Why it's available
  missingPrerequisites?: string[]; // If not fully available
}

// Category Info
export interface CategoryInfo {
  key: CourseCategory;
  name: string;
  color: string;
  requiredUnits?: number;
}

// Export data structure for JSON
export interface ExportData {
  curriculum: Curriculum;
  progress: StudentProgress;
  version: string;
}
