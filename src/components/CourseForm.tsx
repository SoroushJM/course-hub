import { useState } from "react";
import type { Course, CourseCategory } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CourseFormProps {
  course?: Course;
  allCourses: Course[];
  onSubmit: (course: Omit<Course, "id"> & { id?: string }) => void;
  onCancel: () => void;
}

const categoryOptions: { value: CourseCategory; label: string }[] = [
  { value: "general", label: "دروس عمومی" },
  { value: "required-basic", label: "دروس الزامی-پایه" },
  { value: "required-core", label: "دروس الزامی-هسته مشترک" },
  { value: "required-major", label: "دروس الزامی-رشته" },
  { value: "elective-selection", label: "دروس اختیاری-انتخاب" },
  { value: "elective-guided", label: "دروس اختیاری/کهاد" },
];

export const CourseForm = ({
  course,
  allCourses,
  onSubmit,
  onCancel,
}: CourseFormProps) => {
  const [formData, setFormData] = useState({
    name: course?.name || "",
    units: course?.units || 3,
    category: course?.category || ("general" as CourseCategory),
    prerequisites: course?.prerequisites || [],
    corequisites: course?.corequisites || [],
    semester: course?.semester || undefined,
  });

  const [selectedPrereq, setSelectedPrereq] = useState("");
  const [selectedCoreq, setSelectedCoreq] = useState("");

  const availableCourses = allCourses.filter(
    (c) => c.id !== course?.id && !formData.prerequisites.includes(c.id)
  );

  const availableCoreqs = allCourses.filter(
    (c) => c.id !== course?.id && !formData.corequisites.includes(c.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: course?.id,
    });
  };

  const addPrerequisite = () => {
    if (selectedPrereq && !formData.prerequisites.includes(selectedPrereq)) {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, selectedPrereq],
      });
      setSelectedPrereq("");
    }
  };

  const removePrerequisite = (prereqId: string) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites.filter((id) => id !== prereqId),
    });
  };

  const addCorequisite = () => {
    if (selectedCoreq && !formData.corequisites.includes(selectedCoreq)) {
      setFormData({
        ...formData,
        corequisites: [...formData.corequisites, selectedCoreq],
      });
      setSelectedCoreq("");
    }
  };

  const removeCorequisite = (coreqId: string) => {
    setFormData({
      ...formData,
      corequisites: formData.corequisites.filter((id) => id !== coreqId),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">نام درس</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="مثال: مبانی علوم کامپیوتر"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="units">تعداد واحد</Label>
          <Input
            id="units"
            type="number"
            min="1"
            max="6"
            value={formData.units}
            onChange={(e) =>
              setFormData({ ...formData, units: parseInt(e.target.value) })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">ترم پیشنهادی (اختیاری)</Label>
          <Input
            id="semester"
            type="number"
            min="1"
            max="12"
            value={formData.semester || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                semester: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="مثال: 1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">دسته‌بندی</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value as CourseCategory })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>پیش‌نیازها</Label>
        <div className="flex gap-2">
          <Select value={selectedPrereq} onValueChange={setSelectedPrereq}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب درس..." />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addPrerequisite}>
            افزودن
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.prerequisites.map((prereqId) => {
            const prereqCourse = allCourses.find((c) => c.id === prereqId);
            return prereqCourse ? (
              <div
                key={prereqId}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
              >
                {prereqCourse.name}
                <button
                  type="button"
                  onClick={() => removePrerequisite(prereqId)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>همنیازها</Label>
        <div className="flex gap-2">
          <Select value={selectedCoreq} onValueChange={setSelectedCoreq}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب درس..." />
            </SelectTrigger>
            <SelectContent>
              {availableCoreqs.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addCorequisite}>
            افزودن
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.corequisites.map((coreqId) => {
            const coreqCourse = allCourses.find((c) => c.id === coreqId);
            return coreqCourse ? (
              <div
                key={coreqId}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
              >
                {coreqCourse.name}
                <button
                  type="button"
                  onClick={() => removeCorequisite(coreqId)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit">{course ? "ویرایش" : "افزودن"} درس</Button>
      </div>
    </form>
  );
};
