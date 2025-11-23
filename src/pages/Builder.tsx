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
import { MultiSelectCourse } from "@/components/MultiSelectCourse";


export const Builder: React.FC = () => {
  const { template, saveTemplateVersion } = useCurriculum();

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

  const removeCourse = (groupId: string, courseId: string) => {
    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.map((g) => {
        if (g.id === groupId) {
          return { ...g, courses: g.courses.filter((c) => c.id !== courseId) };
        }
        return g;
      }),
    });
  };

  const updateCourse = (
    groupId: string,
    courseId: string,
    field: keyof Course,
    value: string | number | string[]
  ) => {
    // Handle Title Change (which changes ID)
    if (field === "title") {
      const newTitle = value as string;
      if (newTitle === courseId) return; // No change

      // Check uniqueness
      const existingTitles = getAllCourseTitles();
      // We exclude the current course's title from the check effectively by checking if it exists AND it's not THIS course.
      // But since we have the list of ALL titles, we just check if it includes the new title.
      // Wait, if I rename "A" to "B", and "B" exists, that's a collision.
      if (existingTitles.includes(newTitle)) {
        toast.error("نام درس تکراری است. لطفا نام دیگری انتخاب کنید.");
        return;
      }

      // Proceed with update:
      // 1. Update this course's title AND id
      // 2. Update ALL other courses' prerequisites/corequisites that referenced the old ID

      const oldId = courseId;
      const newId = newTitle;

      const newGroups = localTemplate.groups.map((g) => ({
        ...g,
        courses: g.courses.map((c) => {
          // Update the target course
          if (c.id === oldId) {
            return { ...c, title: newTitle, id: newId };
          }
          // Update references in other courses
          return {
            ...c,
            prerequisites: c.prerequisites.map((p) =>
              p === oldId ? newId : p
            ),
            corequisites: c.corequisites.map((co) =>
              co === oldId ? newId : co
            ),
          };
        }),
      }));

      setLocalTemplate({ ...localTemplate, groups: newGroups });
      return;
    }

    // Normal update
    setLocalTemplate({
      ...localTemplate,
      groups: localTemplate.groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            courses: g.courses.map((c) =>
              c.id === courseId ? { ...c, [field]: value } : c
            ),
          };
        }
        return g;
      }),
    });
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
                  <div
                    key={course.id}
                    className="flex items-end gap-2 p-2 bg-muted/30 rounded-md"
                  >
                    <div className="grid gap-2 flex-1 md:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">نام درس (شناسه)</Label>
                        <Input
                          className="h-8"
                          value={course.title}
                          onChange={(e) =>
                            updateCourse(
                              group.id,
                              course.id,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">واحد</Label>
                        <Input
                          className="h-8"
                          type="number"
                          value={course.units}
                          onChange={(e) =>
                            updateCourse(
                              group.id,
                              course.id,
                              "units",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">پیش‌نیاز</Label>
                        <MultiSelectCourse
                          options={allCourses.filter((c) => c.id !== course.id)}
                          selected={course.prerequisites}
                          onChange={(selected) =>
                            updateCourse(
                              group.id,
                              course.id,
                              "prerequisites",
                              selected
                            )
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeCourse(group.id, course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
    </div>
  );
};
