import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Course, PassedCourse } from '../types';
import { useCurriculum } from '../store';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface CourseItemProps {
  course: Course;
}

export const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  const { userProgress, toggleCourse, isPrerequisiteMet } = useCurriculum();
  
  const passedCourse = userProgress.passedCourses.find((c: PassedCourse) => c.courseId === course.id);
  const isPassed = !!passedCourse;
  const isPrereqMet = isPrerequisiteMet(course);

  const handleToggle = () => {
    toggleCourse(course.id);
  };

  const handleTermSelect = (term: number) => {
    toggleCourse(course.id, term);
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-border/50 hover:bg-background/50 hover:shadow-sm",
        isPassed ? "bg-green-50/50 dark:bg-green-900/10" : "bg-card/50",
        !isPrereqMet && !isPassed && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex items-center justify-center">
          <Checkbox
            id={`course-${course.id}`}
            checked={isPassed}
            onCheckedChange={handleToggle}
            className={cn(
              "h-6 w-6 rounded-md border-2 transition-all duration-300",
              isPassed
                ? "bg-green-500 border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                : "border-muted-foreground/30 hover:border-primary/50"
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`course-${course.id}`}
            className={cn(
              "text-base font-medium leading-none cursor-pointer transition-colors",
              isPassed
                ? "text-foreground"
                : "text-foreground/80 group-hover:text-primary"
            )}
          >
            {course.title}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-normal bg-background/50 text-muted-foreground border-border/50"
            >
              {course.units} واحد
            </Badge>

            {!isPrereqMet && !isPassed && (
              <Badge
                variant="destructive"
                className="text-[10px] h-5 px-2 gap-1 shadow-sm animate-pulse"
              >
                <AlertTriangle className="w-3 h-3" />
                پیش‌نیاز رعایت نشده
              </Badge>
            )}

            {course.prerequisites.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                <span className="opacity-70">پیش‌نیاز:</span>
                <span className="font-medium">
                  {course.prerequisites.join("، ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPassed && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400"
              >
                ترم {passedCourse.term}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((t) => (
                  <Button
                    key={t}
                    variant={passedCourse.term === t ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 text-xs",
                      passedCourse.term === t &&
                        "bg-green-600 hover:bg-green-700"
                    )}
                    onClick={() => handleTermSelect(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
