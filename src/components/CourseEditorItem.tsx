import React, { useState, useEffect } from "react";
import type { Course } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { MultiSelectCourse } from "./MultiSelectCourse";

interface CourseEditorItemProps {
  course: Course;
  allCourses: { id: string; title: string }[];
  onUpdate: (
    courseId: string,
    field: keyof Course,
    value: string | number | string[]
  ) => void;
  onRemove: (courseId: string) => void;
  onRenameRequest: (courseId: string, newTitle: string) => Promise<boolean>;
}

export const CourseEditorItem: React.FC<CourseEditorItemProps> = ({
  course,
  allCourses,
  onUpdate,
  onRemove,
  onRenameRequest,
}) => {
  // Local state for inputs to prevent parent re-renders on every keystroke
  const [localTitle, setLocalTitle] = useState(course.title);
  const [localUnits, setLocalUnits] = useState(course.units.toString());

  // Sync local state if props change externally (e.g. revert or load)
  useEffect(() => {
    setLocalTitle(course.title);
  }, [course.title]);

  useEffect(() => {
    setLocalUnits(course.units.toString());
  }, [course.units]);

  const handleTitleBlur = async () => {
    if (localTitle === course.title) return;

    // Request rename from parent
    const success = await onRenameRequest(course.id, localTitle);
    if (!success) {
      // If rejected (duplicate), revert local state
      setLocalTitle(course.title);
    }
  };

  const handleUnitsBlur = () => {
    const val = parseInt(localUnits) || 0;
    if (val !== course.units) {
      onUpdate(course.id, "units", val);
    }
  };

  return (
    <div className="flex items-end gap-2 p-2 bg-muted/30 rounded-md">
      <div className="grid gap-2 flex-1 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs">نام درس (شناسه)</Label>
          <Input
            className="h-8"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleBlur}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">واحد</Label>
          <Input
            className="h-8"
            type="number"
            value={localUnits}
            onChange={(e) => setLocalUnits(e.target.value)}
            onBlur={handleUnitsBlur}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">پیش‌نیاز</Label>
          <MultiSelectCourse
            options={allCourses.filter((c) => c.id !== course.id)}
            selected={course.prerequisites}
            onChange={(selected) =>
              onUpdate(course.id, "prerequisites", selected)
            }
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => onRemove(course.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
