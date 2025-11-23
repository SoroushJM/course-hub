import React, { useState, useEffect } from "react";
import type { CurriculumTemplate, CourseGroup, Course } from "../types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useCurriculum } from "@/store";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { TemplateManager } from "@/components/TemplateManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourseEditorItem } from "@/components/CourseEditorItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Builder: React.FC = () => {
  const { template, saveTemplateVersion } = useCurriculum();
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  // Initialize state with existing template or empty default
  const [localTemplate, setLocalTemplate] = useState<CurriculumTemplate>(
    template || {
      id: "new-template",
      title: "چارت جدید",
      university: "",
      totalUnitsRequired: 140,
      groups: [],
    }
  );

  // Sync local state when global template changes (e.g. loaded from Manager)
  useEffect(() => {
    if (template) {
      setLocalTemplate(template);
    }
  }, [template]);

  const handleSaveVersion = () => {
    // Final validation before save
    const titles = getAllCourseTitles();
    const uniqueTitles = new Set(titles);
    if (titles.length !== uniqueTitles.size) {
      setDuplicateError("نام برخی از دروس تکراری است. لطفا اصلاح کنید.");
      return;
    }
    saveTemplateVersion(localTemplate);
    toast.success("نسخه جدید ذخیره شد");
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(localTemplate, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${localTemplate.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const addGroup = () => {
    const newGroup: CourseGroup = {
      id: `group-${Date.now()}`,
      title: "گروه جدید",
      requiredUnits: 0,
      courses: [],
    };
    setLocalTemplate({
      ...localTemplate,
      groups: [...localTemplate.groups, newGroup],
    });
  };

  const removeGroup = (groupId: string) => {
    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.filter((g) => g.id !== groupId),
    });
  };

  const updateGroup = (
    groupId: string,
    field: keyof CourseGroup,
    value: string | number
  ) => {
    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g
      ),
    });
  };

  const getAllCourseTitles = () => {
    return localTemplate.groups.flatMap((g) => g.courses.map((c) => c.title));
  };

  const addCourse = (groupId: string) => {
    const defaultTitle = "درس جدید";
    let title = defaultTitle;
    let counter = 1;
    const existingTitles = getAllCourseTitles();

    while (existingTitles.includes(title)) {
      title = `${defaultTitle} ${counter}`;
      counter++;
    }

    const newCourse: Course = {
      id: title, // ID is same as Title
      title: title,
      units: 3,
      prerequisites: [],
      corequisites: [],
    };

    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.map((g) => {
        if (g.id === groupId) {
          return { ...g, courses: [...g.courses, newCourse] };
        }
        return g;
      }),
    });
  };

  const removeCourse = (courseId: string) => {
    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.map((g) => ({
        ...g,
        courses: g.courses.filter((c) => c.id !== courseId),
      })),
    });
  };

  const updateCourse = (
    courseId: string,
    field: keyof Course,
    value: string | number | string[]
  ) => {
    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.map((g) => ({
        ...g,
        courses: g.courses.map((c) =>
          c.id === courseId ? { ...c, [field]: value } : c
        ),
      })),
    });
  };

  const handleRenameRequest = async (
    courseId: string,
    newTitle: string
  ): Promise<boolean> => {
    // Check uniqueness
    const existingTitles = getAllCourseTitles();
    // Check if newTitle exists AND it's not the current course's title (which shouldn't happen here anyway as we check for change in child)
    // Actually, we just check if newTitle is in the list of ALL titles.
    // But wait, the list contains the OLD title of this course.
    // So if I rename "A" to "B", and "B" exists, it's a dupe.
    if (existingTitles.includes(newTitle)) {
      setDuplicateError(
        `نام درس "${newTitle}" تکراری است. هر درس باید نام منحصر به فرد داشته باشد.`
      );
      return false;
    }

    // If unique, commit the change (update ID and cascade)
    const oldId = courseId;
    const newId = newTitle;

    const newGroups = localTemplate.groups.map((g) => ({
      ...g,
      courses: g.courses.map((c) => {
        // Update the target course ID
        if (c.id === oldId) {
          return { ...c, id: newId, title: newTitle };
        }
        // Update references in other courses
        return {
          ...c,
          prerequisites: c.prerequisites.map((p) => (p === oldId ? newId : p)),
          corequisites: c.corequisites.map((co) => (co === oldId ? newId : co)),
        };
      }),
    }));

    setLocalTemplate({ ...localTemplate, groups: newGroups });
    return true;
  };

  const allCourses = localTemplate.groups
    .flatMap((g) => g.courses)
    .map((c) => ({ id: c.id, title: c.title }));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">ویرایشگر چارت</h1>
        </div>
        <div className="flex gap-2">
          <TemplateManager />
          <Button variant="outline" onClick={handleExport}>
            <Save className="ml-2 h-4 w-4" />
            دانلود JSON
          </Button>
          <Button onClick={handleSaveVersion}>
            <Save className="ml-2 h-4 w-4" />
            ذخیره نسخه جدید
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات کلی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>عنوان چارت</Label>
            <Input
              value={localTemplate.title}
              onChange={(e) =>
                setLocalTemplate({ ...localTemplate, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>دانشگاه</Label>
            <Input
              value={localTemplate.university}
              onChange={(e) =>
                setLocalTemplate({
                  ...localTemplate,
                  university: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>شناسه (ID)</Label>
            <Input
              disabled
              value={localTemplate.id}
              className="bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              شناسه به صورت خودکار مدیریت می‌شود.
            </p>
          </div>
          <div className="space-y-2">
            <Label>کل واحد مورد نیاز</Label>
            <Input
              type="number"
              value={localTemplate.totalUnitsRequired}
              onChange={(e) =>
                setLocalTemplate({
                  ...localTemplate,
                  totalUnitsRequired: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {localTemplate.groups.map((group) => (
          <Card key={group.id} className="relative border-dashed border-2">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeGroup(group.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader>
              <div className="grid gap-4 md:grid-cols-3 pr-8">
                <div className="space-y-2">
                  <Label>عنوان گروه</Label>
                  <Input
                    value={group.title}
                    onChange={(e) =>
                      updateGroup(group.id, "title", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>واحد الزامی</Label>
                  <Input
                    type="number"
                    value={group.requiredUnits}
                    onChange={(e) =>
                      updateGroup(
                        group.id,
                        "requiredUnits",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID گروه مقصد سرریز (اختیاری)</Label>
                  <Input
                    value={group.overflowTargetGroupId || ""}
                    onChange={(e) =>
                      updateGroup(
                        group.id,
                        "overflowTargetGroupId",
                        e.target.value
                      )
                    }
                    placeholder="مثلا: minor"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="space-y-4">
                {group.courses.map((course) => (
                  <CourseEditorItem
                    key={course.id}
                    course={course}
                    allCourses={allCourses}
                    onUpdate={updateCourse}
                    onRemove={removeCourse}
                    onRenameRequest={handleRenameRequest}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => addCourse(group.id)}
                >
                  <Plus className="ml-2 h-4 w-4" />
                  افزودن درس
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          className="w-full py-8 border-dashed"
          onClick={addGroup}
        >
          <Plus className="ml-2 h-5 w-5" />
          افزودن گروه درسی جدید
        </Button>
      </div>

      <AlertDialog
        open={!!duplicateError}
        onOpenChange={(open) => {
          if (!open) setDuplicateError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>خطای تکرار نام درس</AlertDialogTitle>
            <AlertDialogDescription>{duplicateError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDuplicateError(null)}>
              متوجه شدم
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
