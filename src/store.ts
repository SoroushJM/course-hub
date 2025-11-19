import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurriculumTemplate, UserProgress, Course, PassedCourse, CourseGroup } from './types';

interface CurriculumState {
  template: CurriculumTemplate | null;
  userProgress: UserProgress;
  isLoading: boolean;
  
  // Actions
  loadTemplate: (templateId: string) => Promise<void>;
  toggleCourse: (courseId: string, term?: number) => void;
  setTemplate: (template: CurriculumTemplate) => void;
  resetProgress: () => void;
  
  // Getters (Computed)
  getGroupProgress: (groupId: string) => { passed: number; required: number; overflow: number };
  isPrerequisiteMet: (course: Course) => boolean;
}

const curriculumStore: StateCreator<CurriculumState, [["zustand/persist", unknown]]> = (set, get) => ({
  template: null,
  userProgress: {
    templateId: '',
    passedCourses: [],
  },
  isLoading: false,

  loadTemplate: async (templateId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}templates/${templateId === 'cs-1402' ? 'cs-default' : templateId}.json`);
      const data = await response.json();
      set({ template: data, userProgress: { ...get().userProgress, templateId } });
    } catch (error) {
      console.error("Failed to load template", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setTemplate: (template: CurriculumTemplate) => {
    set({ template, userProgress: { ...get().userProgress, templateId: template.id } });
  },

  toggleCourse: (courseId: string, term: number = 1) => {
    set((state) => {
      const exists = state.userProgress.passedCourses.find((c: PassedCourse) => c.courseId === courseId);
      let newPassedCourses;
      
      if (exists) {
        newPassedCourses = state.userProgress.passedCourses.filter((c: PassedCourse) => c.courseId !== courseId);
      } else {
        newPassedCourses = [...state.userProgress.passedCourses, { courseId, term }];
      }
      
      return {
        userProgress: {
          ...state.userProgress,
          passedCourses: newPassedCourses,
        },
      };
    });
  },

  resetProgress: () => {
    set((state) => ({
      userProgress: {
        templateId: state.template?.id || '',
        passedCourses: [],
      },
    }));
  },

  getGroupProgress: (groupId: string) => {
    const state = get();
    if (!state.template) return { passed: 0, required: 0, overflow: 0 };

    const group = state.template.groups.find((g: CourseGroup) => g.id === groupId);
    if (!group) return { passed: 0, required: 0, overflow: 0 };

    // Calculate passed units for THIS group
    const passedUnits = group.courses.reduce((acc: number, course: Course) => {
      const isPassed = state.userProgress.passedCourses.some((p: PassedCourse) => p.courseId === course.id);
      return acc + (isPassed ? course.units : 0);
    }, 0);

    // Check if OTHER groups overflow into THIS group
    let overflowIncoming = 0;
    state.template.groups.forEach((otherGroup: CourseGroup) => {
      if (otherGroup.overflowTargetGroupId === groupId) {
        // Calculate other group's progress
        const otherPassed = otherGroup.courses.reduce((acc: number, course: Course) => {
          const isPassed = state.userProgress.passedCourses.some((p: PassedCourse) => p.courseId === course.id);
          return acc + (isPassed ? course.units : 0);
        }, 0);
        
        if (otherPassed > otherGroup.requiredUnits) {
          overflowIncoming += (otherPassed - otherGroup.requiredUnits);
        }
      }
    });

    return {
      passed: passedUnits + overflowIncoming,
      required: group.requiredUnits,
      overflow: (passedUnits > group.requiredUnits) ? (passedUnits - group.requiredUnits) : 0
    };
  },

  isPrerequisiteMet: (course: Course) => {
    const state = get();
    if (!course.prerequisites || course.prerequisites.length === 0) return true;
    
    return course.prerequisites.every((prereqId: string) => 
      state.userProgress.passedCourses.some((p: PassedCourse) => p.courseId === prereqId)
    );
  },
});

export const useCurriculum = create<CurriculumState>()(
  persist(
    curriculumStore,
    {
      name: 'unichart-storage',
      partialize: (state) => ({ userProgress: state.userProgress }),
    }
  )
);
