# Project Specification: "UniChart" - Persian Curriculum Planner

## 1. Project Overview
**UniChart** is a client-side, open-source web application designed to help university students (specifically starting with Computer Science) plan their curriculum ("Chart-e Darsi").
The application allows users to:
1.  View a curriculum template (Courses, Groups, Prerequisites).
2.  Create/Edit curriculum templates (Builder Mode).
3.  Track their progress by marking courses as passed and assigning a semester.
4.  Export their data (JSON) to share or move devices.

**Core Philosophy:** Privacy-first (LocalStorage only), Community-driven (new majors added via GitHub PRs), and Offline-capable.

## 2. Technical Stack & Constraints
*   **Framework:** React.js (Vite).
*   **Styling:** Tailwind CSS (v4).
*   **UI Component Library:** Shadcn UI (essential for consistent design).
*   **Icons:** Lucide React.
*   **Language:** **Persian (Farsi)** only. The interface must be strictly **RTL** (Right-to-Left).
*   **Hosting:** GitHub Pages (Static hosting).
*   **Backend:** None. All data persists in `localStorage`.
*   **Data Interchange:** JSON files.

## 3. Architecture & Data Flow

### 3.1. File Storage Strategy (GitHub Pages)
Since there is no backend, the application loads "Official Templates" from the static public directory.
*   **Directory Structure:**
    *   `/public/templates/registry.json`: A list of available majors (e.g., "Computer Science - 1402").
    *   `/public/templates/cs-default.json`: The actual template file containing course data.
*   **Community Contribution:** To add a new major, a developer creates a JSON file and submits a Pull Request (PR) to the GitHub repository adding the file and updating the registry.

### 3.2. Data Models (TypeScript Interfaces)

The application uses these specific data structures to ensure the "Overflow" and "Prerequisite" logic works.

```typescript
// 1. The Template (The Map)
interface CurriculumTemplate {
  id: string;
  title: string; // e.g., "علوم کامپیوتر - ورودی ۱۴۰۲"
  university: string;
  totalUnitsRequired: number;
  groups: CourseGroup[];
}

// 2. The Groups (e.g., General, Core, Elective)
interface CourseGroup {
  id: string;
  title: string; // e.g., "دروس الزامی - مشترک هسته", "دروس اختیاری"
  requiredUnits: number; // How many units MUST be passed in this group
  
  // THE OVERFLOW LOGIC
  // If true, points above 'requiredUnits' are calculated normally.
  // If 'overflowTargetGroupId' is set, extra points count toward THAT group instead.
  overflowTargetGroupId?: string; // ID of the "Kahad" (Minor) group
  
  courses: Course[];
}

// 3. The Course
interface Course {
  id: string;
  title: string; // e.g., "ریاضی عمومی ۱"
  units: number; // e.g., 3
  
  // Logic: Simple array of Course IDs that are required
  prerequisites: string[]; 
  
  // Logic: Array of Course IDs that must be taken in the same term
  corequisites: string[]; 
  
  description?: string; // e.g., "اجازه گروه required"
}

// 4. User Progress (The Save File)
interface UserProgress {
  templateId: string;
  passedCourses: PassedCourse[];
}

interface PassedCourse {
  courseId: string;
  term: number; // e.g., 1, 2, 3... (User manually selects this)
  grade?: number; // Optional
}
```

## 4. Key Features & User Logic

### 4.1. The "Dashboard" (Tracker Mode)
*   **Loading:** On load, check `localStorage`.
    *   If empty: Show "Select Major" screen (fetch `registry.json`) OR "Import JSON" OR "Create New".
    *   If data exists: Load the Template and the User Progress.
*   **Display:** Render `CourseGroup` components dynamically. Do not hardcode "General" or "Basic". Iterate through the `groups` array.
*   **Status Indicators:**
    *   **Not Passed:** Default state.
    *   **Passed:** Green checkmark.
    *   **Locked:** Visual indication (greyed out) if prerequisites are not met (but see Logic 4.4).

### 4.2. The "Builder" (Editor Mode)
*   A GUI form to create `CurriculumTemplate` JSON.
*   **Actions:**
    *   Add/Remove Group.
    *   Set `overflowTargetGroupId` (Dropdown showing other groups).
    *   Add Course (Inputs: Name, Units).
    *   Set Prerequisites (Multi-select Dropdown of *already added* courses).
*   **Export:** Button to "Download Template JSON" (for making a PR to GitHub).

### 4.3. Unit Calculation & Overflow Logic (Crucial)
The application must calculate totals in real-time.
*   **Algorithm:**
    1.  Calculate `sum(passed_units)` for `Group A`.
    2.  If `Group A` has an `overflowTargetGroupId` (e.g., pointing to `Group B`):
        *   If `sum > requiredUnits`:
            *   Keep `requiredUnits` count in `Group A`.
            *   Add `(sum - requiredUnits)` to the specific "Overflow" counter of `Group B`.
    3.  Display totals as: "Passed: X / Required: Y".

### 4.4. Prerequisite "Soft" Validation
*   When a user clicks a checkbox to mark a course as passed:
    *   **Check:** Are all IDs in `course.prerequisites` present in `UserProgress.passedCourses`?
    *   **If False:** Do **not** block the user. Instead, show a **Warning Toast** (Notification): "هشدار: شما هنوز پیش‌نیاز این درس را پاس نکرده‌اید." (Warning: You have not passed the prerequisite yet).
    *   **Reason:** Sometimes students get special permission.

### 4.5. Semester Tracking
*   When checking a course, a small popover or inline selector asks: "Which Term?" (e.g., Term 1 - Term 8+).
*   This is **Optional**. Default to "Unknown Term" if skipped.
*   **Term View:** A toggle button to switch the main view from "Group View" to "Term View" (Courses grouped by the Semester user selected).

## 5. User Interface (UI) Guidelines
*   **Direction:** `dir="rtl"` on the root.
*   **Font:** Vazirmatn FD (Farsi Digits).
*   **Components:**
    *   **Accordion:** Use Shadcn Accordions for Course Groups (Expand/Collapse).
    *   **Progress Bar:** Visual bar at the top showing % of total degree completion.
    *   **Alerts:** Use for "Ejaze Grooh" (Department Permission) notes inside groups.
