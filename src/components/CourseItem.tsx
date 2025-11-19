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
    <div className={cn(
      "flex items-center justify-between p-3 border rounded-lg mb-2 transition-colors",
      isPassed ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900" : "bg-card",
      !isPrereqMet && !isPassed && "opacity-70"
    )}>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox 
          id={`course-${course.id}`} 
          checked={isPassed}
          onCheckedChange={handleToggle}
          className={cn(isPassed && "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600")}
        />
        <div className="flex flex-col">
          <label 
            htmlFor={`course-${course.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {course.title}
          </label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{course.units} واحد</span>
            {!isPrereqMet && !isPassed && (
              <Badge variant="destructive" className="text-[10px] h-5 px-1">
                <AlertTriangle className="w-3 h-3 ml-1" />
                پیش‌نیاز
              </Badge>
            )}
            {course.prerequisites.length > 0 && (
               <span className="text-[10px] text-muted-foreground">
                 (پیش‌نیاز: {course.prerequisites.join('، ')})
               </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPassed && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                ترم {passedCourse.term}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                  <Button
                    key={t}
                    variant={passedCourse.term === t ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
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
