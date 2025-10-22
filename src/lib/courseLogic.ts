import type { Course, PassedCourse, AvailableCourse } from "@/types/course";

// Check if a course's prerequisites are met
export const arePrerequisitesMet = (
  course: Course,
  passedCourseIds: string[]
): boolean => {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return true;
  }

  return course.prerequisites.every((prereqId) =>
    passedCourseIds.includes(prereqId)
  );
};

// Get available courses based on passed courses
export const getAvailableCourses = (
  allCourses: Course[],
  passedCourses: PassedCourse[]
): AvailableCourse[] => {
  const passedCourseIds = passedCourses.map((pc) => pc.courseId);

  return allCourses
    .filter((course) => !passedCourseIds.includes(course.id))
    .map((course) => {
      const prerequisitesMet = arePrerequisitesMet(course, passedCourseIds);
      const missingPrerequisites = course.prerequisites?.filter(
        (prereqId) => !passedCourseIds.includes(prereqId)
      );

      return {
        ...course,
        reason: prerequisitesMet
          ? "تمام پیش‌نیازها گذرانده شده"
          : `پیش‌نیازهای باقی‌مانده: ${missingPrerequisites?.length || 0}`,
        missingPrerequisites: prerequisitesMet
          ? undefined
          : missingPrerequisites,
      };
    });
};

// Get only fully available courses (all prerequisites met)
export const getFullyAvailableCourses = (
  allCourses: Course[],
  passedCourses: PassedCourse[]
): Course[] => {
  const passedCourseIds = passedCourses.map((pc) => pc.courseId);

  return allCourses.filter(
    (course) =>
      !passedCourseIds.includes(course.id) &&
      arePrerequisitesMet(course, passedCourseIds)
  );
};

// Calculate total units passed
export const calculateUnitsCompleted = (
  courses: Course[],
  passedCourses: PassedCourse[]
): number => {
  const passedCourseIds = passedCourses.map((pc) => pc.courseId);
  return courses
    .filter((course) => passedCourseIds.includes(course.id))
    .reduce((sum, course) => sum + course.units, 0);
};

// Calculate units by category
export const calculateUnitsByCategory = (
  courses: Course[],
  passedCourses: PassedCourse[]
): Record<string, number> => {
  const passedCourseIds = passedCourses.map((pc) => pc.courseId);
  const passedCoursesList = courses.filter((course) =>
    passedCourseIds.includes(course.id)
  );

  const unitsByCategory: Record<string, number> = {};

  passedCoursesList.forEach((course) => {
    if (!unitsByCategory[course.category]) {
      unitsByCategory[course.category] = 0;
    }
    unitsByCategory[course.category] += course.units;
  });

  return unitsByCategory;
};

// Get course by ID
export const getCourseById = (
  courses: Course[],
  courseId: string
): Course | undefined => {
  return courses.find((course) => course.id === courseId);
};

// Get courses by IDs
export const getCoursesByIds = (
  courses: Course[],
  courseIds: string[]
): Course[] => {
  return courses.filter((course) => courseIds.includes(course.id));
};
