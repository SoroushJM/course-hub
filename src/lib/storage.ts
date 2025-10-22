import type { Curriculum, StudentProgress, ExportData } from "@/types/course";

const STORAGE_KEYS = {
  CURRICULUM: "course-hub-curriculum",
  PROGRESS: "course-hub-progress",
  VERSION: "1.0.0",
};

// Save curriculum to localStorage
export const saveCurriculum = (curriculum: Curriculum): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
  } catch (error) {
    console.error("Error saving curriculum:", error);
    throw new Error("Failed to save curriculum");
  }
};

// Load curriculum from localStorage
export const loadCurriculum = (): Curriculum | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading curriculum:", error);
    return null;
  }
};

// Save progress to localStorage
export const saveProgress = (progress: StudentProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
    throw new Error("Failed to save progress");
  }
};

// Load progress from localStorage
export const loadProgress = (): StudentProgress | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading progress:", error);
    return null;
  }
};

// Export all data as JSON
export const exportData = (): string => {
  const curriculum = loadCurriculum();
  const progress = loadProgress();

  if (!curriculum) {
    throw new Error("No curriculum found to export");
  }

  const exportData: ExportData = {
    curriculum,
    progress: progress || {
      curriculumId: curriculum.id,
      passedCourses: [],
      lastUpdated: new Date().toISOString(),
    },
    version: STORAGE_KEYS.VERSION,
  };

  return JSON.stringify(exportData, null, 2);
};

// Import data from JSON
export const importData = (jsonString: string): void => {
  try {
    const data: ExportData = JSON.parse(jsonString);

    // Validate data structure
    if (!data.curriculum || !data.version) {
      throw new Error("Invalid data format");
    }

    // Save to localStorage
    saveCurriculum(data.curriculum);
    if (data.progress) {
      saveProgress(data.progress);
    }
  } catch (error) {
    console.error("Error importing data:", error);
    throw new Error("Failed to import data. Please check the file format.");
  }
};

// Clear all data
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRICULUM);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};

// Download JSON file
export const downloadJSON = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
