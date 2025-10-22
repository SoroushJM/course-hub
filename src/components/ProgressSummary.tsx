import { useMemo } from "react";
import type { PassedCourse, Curriculum } from "@/types/course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  calculateUnitsCompleted,
  calculateUnitsByCategory,
} from "@/lib/courseLogic";

interface ProgressSummaryProps {
  curriculum: Curriculum;
  passedCourses: PassedCourse[];
}

const categoryNames: Record<string, string> = {
  general: "دروس عمومی",
  "required-basic": "دروس الزامی-پایه",
  "required-core": "دروس الزامی-هسته مشترک",
  "required-major": "دروس الزامی-رشته",
  "elective-selection": "دروس اختیاری-انتخاب",
  "elective-guided": "دروس اختیاری/کهاد",
};

export const ProgressSummary = ({
  curriculum,
  passedCourses,
}: ProgressSummaryProps) => {
  const totalUnits = useMemo(
    () => calculateUnitsCompleted(curriculum.courses, passedCourses),
    [curriculum.courses, passedCourses]
  );

  const unitsByCategory = useMemo(
    () => calculateUnitsByCategory(curriculum.courses, passedCourses),
    [curriculum.courses, passedCourses]
  );

  const progressPercentage = useMemo(() => {
    const targetUnits = curriculum.totalUnits.min;
    return Math.min((totalUnits / targetUnits) * 100, 100);
  }, [totalUnits, curriculum.totalUnits.min]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>خلاصه پیشرفت تحصیلی</CardTitle>
        <CardDescription>
          {curriculum.degree} - {curriculum.major}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              مجموع واحدهای گذرانده شده
            </span>
            <Badge variant="outline" className="text-lg">
              {totalUnits} / {curriculum.totalUnits.min}-
              {curriculum.totalUnits.max} واحد
            </Badge>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {progressPercentage.toFixed(1)}% تکمیل شده
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">واحدهای هر دسته:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(curriculum.categoryRequirements || {}).map(
              ([category, required]) => {
                const completed = unitsByCategory[category] || 0;
                const percentage = (completed / (required || 1)) * 100;
                return (
                  <div
                    key={category}
                    className="bg-secondary/50 rounded-lg p-3 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">
                        {categoryNames[category]}
                      </span>
                      <Badge
                        variant={
                          completed >= (required || 0) ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {completed}/{required}
                      </Badge>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          completed >= (required || 0)
                            ? "bg-green-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            تعداد دروس گذرانده شده: {passedCourses.length} از{" "}
            {curriculum.courses.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
