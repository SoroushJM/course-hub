import type { Course } from "@/types/course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
  allCourses: Course[];
  isPassed?: boolean;
  isAvailable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePass?: () => void;
}

const categoryColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800",
  "required-basic": "bg-green-100 text-green-800",
  "required-core": "bg-purple-100 text-purple-800",
  "required-major": "bg-red-100 text-red-800",
  "elective-selection": "bg-yellow-100 text-yellow-800",
  "elective-guided": "bg-orange-100 text-orange-800",
};

const categoryNames: Record<string, string> = {
  general: "عمومی",
  "required-basic": "الزامی-پایه",
  "required-core": "هسته مشترک",
  "required-major": "الزامی-رشته",
  "elective-selection": "انتخاب",
  "elective-guided": "کهاد",
};

export const CourseCard = ({
  course,
  allCourses,
  isPassed,
  isAvailable,
  onEdit,
  onDelete,
  onTogglePass,
}: CourseCardProps) => {
  const prerequisites = course.prerequisites
    ?.map((id) => allCourses.find((c) => c.id === id)?.name)
    .filter(Boolean);

  const corequisites = course.corequisites
    ?.map((id) => allCourses.find((c) => c.id === id)?.name)
    .filter(Boolean);

  return (
    <Card
      className={`${isPassed ? "bg-green-50 border-green-200" : ""} ${
        isAvailable ? "border-blue-300 shadow-md" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{course.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{course.units} واحد</Badge>
              <Badge className={categoryColors[course.category]}>
                {categoryNames[course.category]}
              </Badge>
              {course.semester && (
                <Badge variant="secondary">ترم {course.semester}</Badge>
              )}
            </CardDescription>
          </div>
          {isPassed && (
            <Badge className="bg-green-600 text-white">
              <BookOpen className="w-3 h-3 mr-1" />
              گذرانده شده
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {prerequisites && prerequisites.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">پیش‌نیازها:</p>
            <div className="flex flex-wrap gap-1">
              {prerequisites.map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {corequisites && corequisites.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">همنیازها:</p>
            <div className="flex flex-wrap gap-1">
              {corequisites.map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {onTogglePass && (
            <Button
              size="sm"
              variant={isPassed ? "outline" : "default"}
              onClick={onTogglePass}
              className="flex-1"
            >
              {isPassed ? "لغو گذراندن" : "علامت به عنوان گذرانده شده"}
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
