import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurriculumTemplate, UserProgress, Course, PassedCourse, CourseGroup } from './types';

interface CurriculumState {
  template: CurriculumTemplate | null;
  userProgress: UserProgress;
  isLoading: boolean;
  customTemplates: CurriculumTemplate[];

  // Actions
  loadTemplate: (templateId: string) => Promise<void>;
  toggleCourse: (courseId: string, term?: number) => void;
  setTemplate: (template: CurriculumTemplate) => void;
  saveTemplateVersion: (template: CurriculumTemplate) => void;
  importTemplate: (template: CurriculumTemplate) => void;
  deleteCustomTemplate: (templateId: string) => void;
  resetProgress: () => void;

  // Getters (Computed)
  getGroupProgress: (groupId: string) => {
    passed: number;
    required: number;
    overflow: number;
  };
  isPrerequisiteMet: (course: Course) => boolean;
}

const curriculumStore: StateCreator<
  CurriculumState,
  [["zustand/persist", unknown]]
> = (set, get) => ({
  template: null,
  userProgress: {
    templateId: "",
    passedCourses: [],
  },
  isLoading: false,
  customTemplates: [],

  loadTemplate: async (templateId: string) => {
    set({ isLoading: true });
    try {
      // 1. Check Custom Templates first
      const customTemplate = get().customTemplates.find(
        (t) => t.id === templateId
      );
      if (customTemplate) {
        set({
          template: customTemplate,
          userProgress: { ...get().userProgress, templateId },
        });
        set({ isLoading: false });
        return;
      }

      // 2. Fetch Official Template
      const response = await fetch(
        `${import.meta.env.BASE_URL}templates/${
          templateId === "cs-1402" ? "cs-default" : templateId
        }.json`
      );
      if (!response.ok) throw new Error("Template not found");

      const data = await response.json();
      set({
        template: data,
        userProgress: { ...get().userProgress, templateId },
      });
    } catch (error) {
      console.error("Failed to load template", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setTemplate: (template: CurriculumTemplate) => {
    set({
      template,
      userProgress: { ...get().userProgress, templateId: template.id },
    });
  },

  saveTemplateVersion: (newTemplate: CurriculumTemplate) => {
    set((state) => {
      const { customTemplates } = state;
      let nextId = newTemplate.id;

      // Logic:
      // If ID has .vX suffix, extract base ID and version.
      // If not, it's base.
      // Find max version for this base ID.

      // Simple Regex to find base ID and version
      // Matches "anything.v" followed by digits at the end
      const versionMatch = newTemplate.id.match(/^(.*)\.v(\d+)$/);

      let baseId = newTemplate.id;
      if (versionMatch) {
        baseId = versionMatch[1];
      }

      // Find all templates with this baseId
      const versions = customTemplates.filter(
        (t) => t.id === baseId || t.id.startsWith(`${baseId}.v`)
      );

      // Determine next version
      let maxVersion = 0;
      versions.forEach((t) => {
        if (t.id === baseId) return; // v0
        const match = t.id.match(/^(.*)\.v(\d+)$/);
        if (match && match[1] === baseId) {
          const v = parseInt(match[2]);
          if (v > maxVersion) maxVersion = v;
        }
      });

      const nextVersion = maxVersion + 1;
      nextId = `${baseId}.v${nextVersion}`;

      // Title logic: Keep the title exactly as is. Do NOT append version.
      const templateToSave = { ...newTemplate, id: nextId };

      return {
        customTemplates: [...customTemplates, templateToSave],
        template: templateToSave,
        userProgress: { ...state.userProgress, templateId: nextId },
      };
    });
  },

  importTemplate: (newTemplate: CurriculumTemplate) => {
    set((state) => {
      // Remove existing if any (overwrite)
      const otherTemplates = state.customTemplates.filter(
        (t) => t.id !== newTemplate.id
      );
      return {
        customTemplates: [...otherTemplates, newTemplate],
        template: newTemplate,
        userProgress: { ...state.userProgress, templateId: newTemplate.id },
      };
    });
  },

  deleteCustomTemplate: (templateId: string) => {
    set((state) => ({
      customTemplates: state.customTemplates.filter((t) => t.id !== templateId),
      // If the deleted template was active, clear it? Or keep it in memory until reload?
      // Let's keep it in memory but it won't be loadable next time.
    }));
  },

  toggleCourse: (courseId: string, term: number = 1) => {
    set((state) => {
      const exists = state.userProgress.passedCourses.find(
        (c: PassedCourse) => c.courseId === courseId
      );
      let newPassedCourses;

      if (exists) {
        newPassedCourses = state.userProgress.passedCourses.filter(
          (c: PassedCourse) => c.courseId !== courseId
        );
      } else {
        newPassedCourses = [
          ...state.userProgress.passedCourses,
          { courseId, term },
        ];
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
        templateId: state.template?.id || "",
        passedCourses: [],
      },
    }));
  },

  getGroupProgress: (groupId: string) => {
    const state = get();
    if (!state.template) return { passed: 0, required: 0, overflow: 0 };

    const group = state.template.groups.find(
      (g: CourseGroup) => g.id === groupId
    );
    if (!group) return { passed: 0, required: 0, overflow: 0 };

    // Calculate passed units for THIS group
    const passedUnits = group.courses.reduce((acc: number, course: Course) => {
      const isPassed = state.userProgress.passedCourses.some(
        (p: PassedCourse) => p.courseId === course.id
      );
      return acc + (isPassed ? course.units : 0);
    }, 0);

    // Check if OTHER groups overflow into THIS group
    let overflowIncoming = 0;
    state.template.groups.forEach((otherGroup: CourseGroup) => {
      if (otherGroup.overflowTargetGroupId === groupId) {
        // Calculate other group's progress
        const otherPassed = otherGroup.courses.reduce(
          (acc: number, course: Course) => {
            const isPassed = state.userProgress.passedCourses.some(
              (p: PassedCourse) => p.courseId === course.id
            );
            return acc + (isPassed ? course.units : 0);
          },
          0
        );

        if (otherPassed > otherGroup.requiredUnits) {
          overflowIncoming += otherPassed - otherGroup.requiredUnits;
        }
      }
    });

    return {
      passed: passedUnits + overflowIncoming,
      required: group.requiredUnits,
      overflow:
        passedUnits > group.requiredUnits
          ? passedUnits - group.requiredUnits
          : 0,
    };
  },

  isPrerequisiteMet: (course: Course) => {
    const state = get();
    if (!course.prerequisites || course.prerequisites.length === 0) return true;

    return course.prerequisites.every((prereqId: string) =>
      state.userProgress.passedCourses.some(
        (p: PassedCourse) => p.courseId === prereqId
      )
    );
  },
});

export const useCurriculum = create<CurriculumState>()(
  persist(curriculumStore, {
    name: "unichart-storage",
    partialize: (state) => ({
      userProgress: state.userProgress,
      customTemplates: state.customTemplates,
    }),
  })
);
